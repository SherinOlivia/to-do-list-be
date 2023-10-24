import { Request, Response } from 'express';
import { DB } from '../config/dbConnection';
import { errorHandling } from './errorHandling';
import { RowDataPacket } from 'mysql2';

// Admin Only!
const getAllStaff = async (req: Request, res: Response) => {
    try {
        const allUser = await DB.promise().query('SELECT * FROM railway.users WHERE role = ?',["staff"]) as RowDataPacket[]

        if (!allUser) {
            return res.status(400).json(errorHandling(null, "User Data Unavailable..."));
        } else {
            return res.status(200).json(errorHandling(allUser[0], null));
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "User Data Retrieval Failed...!!"));
    }
}

// Staff & Admin only!
const getAllClient = async (req: Request, res: Response) => {
    try {
        const clientsData = await DB.promise().query('SELECT * FROM railway.users WHERE role = ?',["client"]) as RowDataPacket[]
    
        if (!clientsData) {
            return res.status(400).json(errorHandling(null, "User Data Unavailable..."));
        } else {
            return res.status(200).json(errorHandling(clientsData[0], null));
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "User Data Retrieval Failed...!!"));
    }
}


// get user by ID aka profile ===> automatically shows specific user their profile (including staff & admin)
const userProfile =async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        if (user) { 
            const userId = user.id
            const userData = await DB.promise().query('SELECT * FROM railway.users WHERE id = ?',[userId]) as RowDataPacket[]
            return res.status(200).json(errorHandling(userData[0], null));
        }

        return res.status(400).json(errorHandling(null, "User Data Not Found..."));
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "User Data Retrieval Failed...!!"));
    }
}

// get user by ID =>>> staff & admin can check specific users, client can only see their own
const getOneUser = async (req: Request, res: Response) => {
    try {
        const { role, id } = (req as any).user;
        const checkId = req.params.id

        if (role == "staff" || role == "admin") {
            const userData = await DB.promise().query('SELECT * FROM railway.users WHERE id = ?',[checkId]) as RowDataPacket[]
            return res.status(200).json(errorHandling(userData[0], null));
        } else if ((role !== "staff" && role !== "admin") && id == checkId) {
            const userData = await DB.promise().query('SELECT * FROM railway.users WHERE id = ?',[id]) as RowDataPacket[]
            return res.status(200).json(errorHandling(userData[0], null));
        } else {
            return res.status(400).json(errorHandling(null, "User Data Not Found..."));
        }
        
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "User Data Retrieval Failed...!!"));
    }
}

// name & address
const updateUser = async (req: Request, res: Response) => {
    try {
        const { role, id } = (req as any).user;

        const checkId = req.params.id
        const { name, address } = req.body

        if ((role !== "staff" && role !== "admin") && id == checkId) {
            await DB.promise().query(`
                UPDATE railway.users
                SET name = ?, address = ?
                WHERE id = ?`,
                [name, address, id]);

            const updatedData = await DB.promise().query(`
                SELECT * FROM railway.users
                WHERE id = ?`,[checkId]);


            res.status(200).json(errorHandling({
                message: "User Data Updated Successfully",
                data: updatedData[0]}, null));
        } else if (role == "staff" || role == "admin") {
            await DB.promise().query(`
                UPDATE railway.users
                SET name = ?, address = ?
                WHERE id = ?`,
                [name, address, checkId])

            const updatedData = await DB.promise().query(`
                SELECT * FROM railway.users
                WHERE id = ?`,[checkId]);

            return res.status(200).json(errorHandling({
                message: "User Data Updated Successfully",
                data: updatedData[0]}, null));
        } else {
            return res.status(400).json(errorHandling(null, "Unauthorized Update...!! Update Failed!!"));
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "User Data Update Failed...!!"));
    }
}


export { getAllStaff, getAllClient, userProfile, getOneUser, updateUser }



