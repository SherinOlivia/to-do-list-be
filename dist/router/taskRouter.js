"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require(".././controller");
const authorizationMiddleware_1 = __importDefault(require("../middleware/authorizationMiddleware"));
const taskrouter = express_1.default.Router();
taskrouter.post('/new', (0, authorizationMiddleware_1.default)(['client', 'staff', 'admin']), controller_1.createTask);
taskrouter.put('/edit/:taskId', (0, authorizationMiddleware_1.default)(['client', 'staff', 'admin']), controller_1.editTask);
taskrouter.patch('/update/:taskId', (0, authorizationMiddleware_1.default)(['client', 'staff', 'admin']), controller_1.updateTaskStatus);
taskrouter.delete('/delete/:taskId', (0, authorizationMiddleware_1.default)(['client', 'staff', 'admin']), controller_1.deleteTask);
// Client can only see theirs
taskrouter.get('/', (0, authorizationMiddleware_1.default)(['client', 'staff', 'admin']), controller_1.getAllTasks);
exports.default = taskrouter;
//# sourceMappingURL=taskRouter.js.map