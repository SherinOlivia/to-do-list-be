import { Request, Response } from 'express';
import { DB } from '../config/dbConnection';
import { errorHandling } from './errorHandling';
import { RowDataPacket } from 'mysql2';
import { format } from 'date-fns';

const createTask = async (req: Request, res: Response) => {
    const { id } = (req as any).user;
    const { title, description, purpose, due_date } =  req.body;
    const date = new Date(due_date);
    const formattedDBDate = format(date, 'yyyy-MM-dd')
    const formattedDate = format(date, 'EEEE, d MMMM yyyy');

    try {
        const [newTask] = await DB.promise().query(
            `INSERT INTO railway.tasks (userId, title, description, purpose, due_date, isDeleted) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, title, description, purpose, formattedDBDate, '0']
        ) as RowDataPacket[];
    
        const getNewTask = await DB.promise().query(`SELECT * FROM railway.tasks WHERE id = ?`, [newTask.insertId])  as RowDataPacket[];
        const taskWithFormattedDate = {
            ...getNewTask[0][0],
            due_date: formattedDate,
        };
    
        return res.status(200).json(errorHandling(taskWithFormattedDate, null));
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorHandling(null, "Failed to create new task..!! Internal Error!"));
    }
    
}

const getAllTasks = async (req: Request, res: Response) => {
    const { role, id } = (req as any).user;

    try {
        if (role === "admin") {
            const taskData = await DB.promise().query('SELECT * FROM railway.tasks') as RowDataPacket[]
            return res.status(200).json(errorHandling(taskData[0], null));
        } else if (role === "staff") {
            const taskData = await DB.promise().query('SELECT * FROM railway.tasks WHERE isDeleted = ?',['0']) as RowDataPacket[]
            return res.status(200).json(errorHandling(taskData[0], null));
        } else if (role === "client") {
            const taskData = await DB.promise().query('SELECT * FROM railway.tasks WHERE userId = ? AND isDeleted = ?',[id, '0']) as RowDataPacket[]
            return res.status(200).json(errorHandling(taskData[0], null));
        } else {
            return res.status(400).json(errorHandling(null, "Task Not Found..."));
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Task Data Retrieval Failed...!!"));
    }
}

const editTask = async (req: Request, res: Response) => {
    const taskId = req.params.taskId
    const { id } = (req as any).user
    const { title, description, purpose, due_date } = req.body

    try {
        const [existingTask] = await DB.promise().query(`SELECT * FROM railway.tasks WHERE id = ? AND isDeleted = ?`, [taskId, '0']) as RowDataPacket[];

        if (existingTask.length !== 0) {
            await DB.promise().query(`UPDATE railway.tasks SET title = ?, description = ?, purpose = ?, due_date = ? WHERE id = ? AND userId = ? AND isDeleted = ?`,
            [title, description, purpose, due_date, taskId, id, '0']) as RowDataPacket[];

            const getUpdatedTask = await DB.promise().query(`SELECT * FROM railway.tasks WHERE id = ?`, [taskId])  as RowDataPacket[];
            return res.status(200).json(errorHandling({message: "Task Successfully Updated!", data: getUpdatedTask[0]}, null));
        } else {
            return res.status(400).json(errorHandling(null, `Task with ${title} title doesn't exist...!!`));
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Task Edit Failed..!! Internal Error!"));
    }
}

const updateTaskStatus = async (req: Request, res: Response) => {
    const taskId = req.params.taskId
    const { id } = (req as any).user
    const { completed } = req.body

    try {
        const [existingTask] = await DB.promise().query(`SELECT * FROM railway.tasks WHERE id = ? AND isDeleted = ?`, [taskId, '0']) as RowDataPacket[];

        if (existingTask.length !== 0) {
            await DB.promise().query(`UPDATE railway.tasks SET completed = ? WHERE id = ? AND userId = ? AND isDeleted = ?`,
            [completed, taskId, id, '0']) as RowDataPacket[];

            const getUpdatedTask = await DB.promise().query(`SELECT * FROM railway.tasks WHERE id = ?`, [taskId]);
            return res.status(200).json(errorHandling({message: "Task Successfully Completed!", data: getUpdatedTask[0]}, null));
        } else {
            return res.status(400).json(errorHandling(null, `Task doesn't exist...!!`));
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Task Status Update Failed..!! Internal Error!"));
    }
}

const deleteTask = async (req: Request, res: Response) => {
    const taskId = req.params.taskId
    const { role, id } = (req as any).user
    
    try {
        const [existingTask] = await DB.promise().query(`SELECT * FROM railway.tasks WHERE id = ? AND userId = ? AND isDeleted = ?`, [taskId, id, '0']) as RowDataPacket[];
        
        if (existingTask.length !== 0) {
            if (role == "admin" || role == "staff") {
                const deleteTask = await DB.promise().query(`UPDATE railway.tasks SET isDeleted = ? WHERE id = ?`,['1', taskId]) as RowDataPacket[]
                return res.status(200).json(errorHandling(deleteTask[0], null));
            } else {
                const deleteTask = await DB.promise().query(`UPDATE railway.tasks SET isDeleted = ? WHERE id = ? AND userId = ?`,['1', taskId, id]) as RowDataPacket[]
                return res.status(200).json(errorHandling(deleteTask[0], null));
            }
        } else {
            return res.status(400).json(errorHandling(null, `Task doesn't exist...!!`));
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(errorHandling(null, "Failed to remove task..!! Internal Error!"));
    }
}

export { createTask, getAllTasks, editTask, updateTaskStatus, deleteTask }