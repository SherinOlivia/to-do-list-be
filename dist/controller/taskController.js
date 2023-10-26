"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTaskStatus = exports.editTask = exports.getAllTasks = exports.createTask = void 0;
const dbConnection_1 = require("../config/dbConnection");
const errorHandling_1 = require("./errorHandling");
const date_fns_1 = require("date-fns");
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { title, description, purpose, due_date } = req.body;
    const parsedDate = (0, date_fns_1.parse)(due_date, 'yyyy-MM-dd', new Date());
    const formattedDate = (0, date_fns_1.format)(parsedDate, 'EEEE, d MMMM yyyy');
    console.log(formattedDate);
    try {
        const [existingTask] = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.tasks WHERE title = ?`, [title]);
        if (existingTask.length === 0) {
            const [newTask] = yield dbConnection_1.DB.promise().query(`INSERT INTO railway.tasks (userId, title, description, purpose, due_date, isDeleted) VALUES (?, ?, ?, ?, ?, ?)`, [id, title, description, purpose, due_date, '0']);
            const getNewTask = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.tasks WHERE id = ?`, [newTask.insertId]);
            const taskWithFormattedDate = Object.assign(Object.assign({}, getNewTask[0][0]), { due_date: formattedDate });
            return res.status(200).json((0, errorHandling_1.errorHandling)(taskWithFormattedDate, null));
        }
        else {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, `Task with ${title} title already exist...!!`));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "Failed to create new task..!! Internal Error!"));
    }
});
exports.createTask = createTask;
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, id } = req.user;
    try {
        if (role === "admin") {
            const taskData = yield dbConnection_1.DB.promise().query('SELECT * FROM railway.tasks');
            return res.status(200).json((0, errorHandling_1.errorHandling)(taskData[0], null));
        }
        else if (role === "staff") {
            const taskData = yield dbConnection_1.DB.promise().query('SELECT * FROM railway.tasks WHERE isDeleted = ?', ['0']);
            return res.status(200).json((0, errorHandling_1.errorHandling)(taskData[0], null));
        }
        else if (role === "client") {
            const taskData = yield dbConnection_1.DB.promise().query('SELECT * FROM railway.tasks WHERE userId = ? AND isDeleted = ?', [id, '0']);
            return res.status(200).json((0, errorHandling_1.errorHandling)(taskData[0], null));
        }
        else {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, "Task Not Found..."));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "Task Data Retrieval Failed...!!"));
    }
});
exports.getAllTasks = getAllTasks;
const editTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskId;
    const { id } = req.user;
    const { title, description, purpose, due_date } = req.body;
    try {
        const [existingTask] = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.tasks WHERE id = ? AND isDeleted = ?`, [taskId, '0']);
        if (existingTask.length !== 0) {
            yield dbConnection_1.DB.promise().query(`UPDATE railway.tasks SET title = ?, description = ?, purpose = ?, due_date = ? WHERE id = ? AND userId = ? AND isDeleted = ?`, [title, description, purpose, due_date, taskId, id, '0']);
            const getUpdatedTask = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.tasks WHERE id = ?`, [taskId]);
            return res.status(200).json((0, errorHandling_1.errorHandling)({ message: "Task Successfully Updated!", data: getUpdatedTask[0] }, null));
        }
        else {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, `Task with ${title} title doesn't exist...!!`));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "Task Edit Failed..!! Internal Error!"));
    }
});
exports.editTask = editTask;
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskId;
    const { id } = req.user;
    const { completed } = req.body;
    try {
        const [existingTask] = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.tasks WHERE id = ? AND isDeleted = ?`, [taskId, '0']);
        if (existingTask.length !== 0) {
            yield dbConnection_1.DB.promise().query(`UPDATE railway.tasks SET completed = ? WHERE id = ? AND userId = ? AND isDeleted = ?`, [completed, taskId, id, '0']);
            const getUpdatedTask = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.tasks WHERE id = ?`, [taskId]);
            return res.status(200).json((0, errorHandling_1.errorHandling)({ message: "Task Successfully Completed!", data: getUpdatedTask[0] }, null));
        }
        else {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, `Task doesn't exist...!!`));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "Task Status Update Failed..!! Internal Error!"));
    }
});
exports.updateTaskStatus = updateTaskStatus;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskId;
    const { role, id } = req.user;
    try {
        const [existingTask] = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.tasks WHERE id = ? AND userId = ? AND isDeleted = ?`, [taskId, id, '0']);
        if (existingTask.length !== 0) {
            if (role == "admin" || role == "staff") {
                const deleteTask = yield dbConnection_1.DB.promise().query(`UPDATE railway.tasks SET isDeleted = ? WHERE id = ?`, ['1', taskId]);
                return res.status(200).json((0, errorHandling_1.errorHandling)(deleteTask[0], null));
            }
            else {
                const deleteTask = yield dbConnection_1.DB.promise().query(`UPDATE railway.tasks SET isDeleted = ? WHERE id = ? AND userId = ?`, ['1', taskId, id]);
                return res.status(200).json((0, errorHandling_1.errorHandling)(deleteTask[0], null));
            }
        }
        else {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, `Task doesn't exist...!!`));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "Failed to remove task..!! Internal Error!"));
    }
});
exports.deleteTask = deleteTask;
