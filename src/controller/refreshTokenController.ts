import { Request, Response } from 'express';
import { errorHandling } from './errorHandling';
import jwt, { Secret } from 'jsonwebtoken';
import JWT_TOKEN from '../config/jwtConfig';


const refreshTokenRequest = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json(errorHandling(null, 'Refresh token not provided'));
        }

        const decodedToken: any = jwt.verify(refreshToken, JWT_TOKEN as Secret);
        const accessToken = jwt.sign(
            {
                username: decodedToken.username,
                id: decodedToken.id,
                role: decodedToken.role
            },
            JWT_TOKEN as Secret,
            { expiresIn: '24h' }
        );

        // Set the new access token in the response cookies
        const accessTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        res.cookie('access_token', accessToken, {
            expires: accessTokenExpiration,
            httpOnly: true
        });

        res.status(200).json(errorHandling({
            message: 'Access token refreshed',
            data: accessToken,
            accessTokenExpiration
        }, null));
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, 'Refresh token is invalid or has expired'));
    }
}