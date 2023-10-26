import express, { Request, Response } from 'express';
import authenMiddleware from '../middleware/authenticationMiddleware';
import userrouter from './userRouter';
import taskrouter from './taskRouter';

const router = express.Router();

router.get("/", function (req: Request, res: Response) {
    res.status(200).json({
        success: true,
        message: "Hello, this is Sherin Olivia's Project Milestone 3 (W18)!"
    })
})

router.use('/api/users', userrouter)
router.use('/api/tasks', authenMiddleware, taskrouter)

export default router;