import express, { Request, Response } from 'express';
import authenMiddleware from '../middleware/authenticationMiddleware';
// import todorouter from './todosRouter';
// import userrouter from './usersRouter';


const router = express.Router();

router.get("/", function (req: Request, res: Response) {
    res.status(200).json({
        success: true,
        message: "Hello, this is Sherin Olivia's Project Milestone 3 (W18)!"
    })
})

// router.use('/api/list', authenMiddleware, todorouter)
// router.use('/api/users', userrouter)

export default router;