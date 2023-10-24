import { Request, Response } from 'express';
import { DB } from '../config/dbConnection';
import { errorHandling } from './errorHandling';
import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';

// default  role : client
const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } =  req.body;
        const hashedPass = await bcrypt.hash(password, 10)
        const [existingUser] = await DB.promise().query(`SELECT * FROM railway.users WHERE email = ?`, [email]) as RowDataPacket[];
        
            if (existingUser.length === 0) {
                const [newUser] = await DB.promise().query(
                `INSERT INTO railway.users (username, email, password, role) VALUES (?, ?, ?, ?)`,
                [username, email, hashedPass, 'client']) as RowDataPacket[];
    
                const getNewUser = await DB.promise().query(`SELECT * FROM railway.users WHERE id = ?`, [newUser.insertId]);
                return res.status(200).json(errorHandling(getNewUser[0], null));
            } else {
                return res.status(400).json(errorHandling(null, "Username already exist...!!"));
            }
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Register User Failed..!! Internal Error!"));
    }
}

// for admin to create staff role
const registerUserByAdmin = async (req: any, res: Response) => {
    try {
        const { username, email, password, role } =  req.body;
        const hashedPass = await bcrypt.hash(password, 10)
        const [existingUser] = await DB.promise().query(`SELECT * FROM railway.users WHERE email = ?`, [email]) as RowDataPacket[];
        
        if (req.role === "admin") {
            console.log(req.role, "<=== test check role")
            if (existingUser.length === 0) {
                const [newUser] = await DB.promise().query(
                `INSERT INTO railway.users (username, email, password, role) VALUES (?, ?, ?, ?)`,
                [username, email, hashedPass, role]) as RowDataPacket[];
    
                const getNewUser = await DB.promise().query(`SELECT * FROM railway.users WHERE id = ?`, [newUser.insertId]);
                return res.status(200).json(errorHandling(getNewUser[0], null));
            } else {
                return res.status(400).json(errorHandling(null, "Username already exist...!!"));
            }
        } 
        return res.status(401).json(errorHandling(null, "Unauthorized Access...!"));
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Register User Failed..!! Internal Error!"));
    }
}

export { registerUser, registerUserByAdmin}