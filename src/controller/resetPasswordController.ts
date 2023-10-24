import { Request, Response } from 'express';
import { DB } from '../config/dbConnection';
import { errorHandling } from './errorHandling';
import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';
import NodeCache from 'node-cache';

const resetPasswordCache = new NodeCache({ stdTTL: 300 });

const resetPasswordRequest = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        const existingUser = await DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]) as RowDataPacket[];
        const user = existingUser[0][0]
        if (!user) {
            return res.status(400).json(errorHandling(null, "User not found"));
        }
        const resetKey = Math.random().toString(36).substring(2, 15);
        resetPasswordCache.set(resetKey, email);

        return res.status(200).json(errorHandling(`"Password reset Request sent to ${email} with ${resetKey}"`, null ));

    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, "Password reset request failed"));
    }
 }

 const resetPassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const resetKey = req.query.resetKey as string;
        const email = resetPasswordCache.get(resetKey);

        if (!email) {
            return res.status(400).json(errorHandling(null, "Invalid token"));
        }

        const user = await DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]) as RowDataPacket[];
        if (!user) {
            return res.status(400).json(errorHandling(null, "User not found"));
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await DB.promise().query("UPDATE railway.users SET password = ? WHERE email = ?", [hashedPassword, email]);

        resetPasswordCache.del(resetKey);
        return res.status(200).json(errorHandling("Password reset success", null));
        
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, "Password reset failed"));
    }
};

export { resetPasswordRequest, resetPassword }