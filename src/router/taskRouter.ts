import express from 'express'
import { createTask, getAllTasks, editTask, updateTaskStatus, deleteTask } from '.././controller';
import authorMiddleware from '../middleware/authorizationMiddleware'

const taskrouter = express.Router()

taskrouter.post('/new', authorMiddleware(['client','staff','admin']), createTask);

taskrouter.put('/edit/:taskId', authorMiddleware(['client','staff','admin']), editTask);

taskrouter.patch('/update/:taskId', authorMiddleware(['client','staff','admin']), updateTaskStatus);

taskrouter.delete('/delete/:taskId', authorMiddleware(['client','staff','admin']), deleteTask);

// Client can only see theirs
taskrouter.get('/', authorMiddleware(['client','staff','admin']), getAllTasks);

export default taskrouter