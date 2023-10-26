"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticationMiddleware_1 = __importDefault(require("../middleware/authenticationMiddleware"));
const userRouter_1 = __importDefault(require("./userRouter"));
const taskRouter_1 = __importDefault(require("./taskRouter"));
const router = express_1.default.Router();
router.get("/", function (req, res) {
    res.status(200).json({
        success: true,
        message: "Hello, this is Sherin Olivia's Project Milestone 3 (W18)!"
    });
});
router.use('/api/users', userRouter_1.default);
router.use('/api/tasks', authenticationMiddleware_1.default, taskRouter_1.default);
exports.default = router;
