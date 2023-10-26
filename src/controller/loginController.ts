import { Request, Response } from 'express';
import { DB } from '../config/dbConnection';
import { errorHandling } from './errorHandling';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import JWT_TOKEN from '../config/jwtConfig';
import { RowDataPacket } from 'mysql2';
import NodeCache from 'node-cache';

const failedLoginAttemptsCache = new NodeCache({ stdTTL: 600 });

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const existingUser = await DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]) as RowDataPacket[];
        
        const failedAttempts = failedLoginAttemptsCache.get<number>(email);
        const user = existingUser[0][0];
        
        console.log(user);
        
        if (failedAttempts !== undefined && failedAttempts >= 5) {
            return res.status(400).json(errorHandling('Too many failed login attempts', null));
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        
        if (passwordCheck) {
            
            let refreshToken = req.cookies.refresh_token;
            if (!refreshToken) {
                refreshToken = jwt.sign({ username: user.username, id: user.id, role: user.role }, JWT_TOKEN, { expiresIn: "7d" });
            }

            const accessToken = jwt.sign({ username: user.username, id: user.id, role: user.role }, JWT_TOKEN, { expiresIn: "24h" });
            
            // Reset limit login
            failedLoginAttemptsCache.del(email);

            // Expiration time for tokens
            const accessTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

            // Cookies
            res.cookie("access_token", accessToken, {
                expires: accessTokenExpiration,
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });

            res.cookie("refresh_token", refreshToken, {
                expires: refreshTokenExpiration,
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });

            return res.status(200).json(errorHandling({
                message: `${user.username} Successfully logged in as ${user.role}`,
                data: accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration
            }, null));
        } else {
            const newFailedAttempts = (failedAttempts || 0) + 1;
            failedLoginAttemptsCache.set(email, newFailedAttempts);
            return res.status(400).json(errorHandling(null, 'Password is incorrect'));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Cannot Connect!! Internal Error!'));
    }
}

const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res.status(200).json(errorHandling("See you next time!", null));
  };

  export { loginUser, logoutUser }