"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticationMiddleware_1 = __importDefault(require("../middleware/authenticationMiddleware"));
const authorizationMiddleware_1 = __importDefault(require("../middleware/authorizationMiddleware"));
const controller_1 = require(".././controller");
const controller_2 = require(".././controller");
const controller_3 = require(".././controller");
const controller_4 = require(".././controller");
const controller_5 = require(".././controller");
const userrouter = express_1.default.Router();
userrouter.post('/register', controller_1.registerUser);
userrouter.post('/admin/register', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['admin']), controller_1.registerUserByAdmin);
userrouter.post('/login', controller_2.loginUser);
userrouter.post('/logout', controller_2.logoutUser);
userrouter.post('/refresh', authenticationMiddleware_1.default, controller_3.refreshTokenRequest);
userrouter.post('/resetpassword/request', controller_4.resetPasswordRequest);
userrouter.post('/resetpassword', controller_4.resetPassword);
userrouter.get('/profile/:id', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['client', 'staff', 'admin']), controller_5.getOneUser);
userrouter.get('/profile', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['client', 'staff', 'admin']), controller_5.userProfile);
userrouter.patch('/update/:id', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['client', 'staff', 'admin']), controller_5.updateUser);
userrouter.get('/clients', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['staff', 'admin']), controller_5.getAllClient);
userrouter.get('/staff', authenticationMiddleware_1.default, (0, authorizationMiddleware_1.default)(['admin']), controller_5.getAllStaff);
exports.default = userrouter;
//# sourceMappingURL=userRouter.js.map