import express from 'express'
import authenMiddleware from '../middleware/authenticationMiddleware'
import authorMiddleware from '../middleware/authorizationMiddleware'
import { registerUser, registerUserByAdmin } from '.././controller';
import { loginUser, logoutUser } from '.././controller';
import { refreshTokenRequest } from '.././controller';
import { resetPasswordRequest, resetPassword } from '.././controller';
import { getAllClient, getAllStaff, getOneUser, userProfile, updateUser } from '.././controller';

const userrouter = express.Router()

userrouter.post('/register', registerUser);
userrouter.post('/admin/register', authenMiddleware, authorMiddleware(['admin']), registerUserByAdmin);

userrouter.post('/login', loginUser);
userrouter.post('/logout', logoutUser);

userrouter.post('/refresh', authenMiddleware, refreshTokenRequest);

userrouter.post('/resetpassword/request', resetPasswordRequest)
userrouter.post('/resetpassword', resetPassword)

userrouter.get('/profile/:id', authenMiddleware, authorMiddleware(['client','staff','admin']), getOneUser);
userrouter.get('/profile', authenMiddleware, authorMiddleware(['client','staff','admin']), userProfile);
userrouter.patch('/update/:id', authenMiddleware, authorMiddleware(['client','staff','admin']), updateUser);

userrouter.get('/clients', authenMiddleware, authorMiddleware(['staff','admin']), getAllClient);
userrouter.get('/staff', authenMiddleware, authorMiddleware(['admin']), getAllStaff);

export default userrouter