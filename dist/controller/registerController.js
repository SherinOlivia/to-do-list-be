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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserByAdmin = exports.registerUser = void 0;
const dbConnection_1 = require("../config/dbConnection");
const errorHandling_1 = require("./errorHandling");
const bcrypt_1 = __importDefault(require("bcrypt"));
// default  role : client
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const hashedPass = yield bcrypt_1.default.hash(password, 10);
        const [existingUser] = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.users WHERE email = ?`, [email]);
        if (existingUser.length === 0) {
            const [newUser] = yield dbConnection_1.DB.promise().query(`INSERT INTO railway.users (username, email, password, role) VALUES (?, ?, ?, ?)`, [username, email, hashedPass, 'client']);
            const getNewUser = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.users WHERE id = ?`, [newUser.insertId]);
            return res.status(200).json((0, errorHandling_1.errorHandling)(getNewUser[0], null));
        }
        else {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, "Username already exist...!!"));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "Register User Failed..!! Internal Error!"));
    }
});
exports.registerUser = registerUser;
// for admin to create staff role
const registerUserByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role } = req.body;
        const hashedPass = yield bcrypt_1.default.hash(password, 10);
        const [existingUser] = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.users WHERE email = ?`, [email]);
        if (req.role === "admin") {
            console.log(req.role, "<=== test check role");
            if (existingUser.length === 0) {
                const [newUser] = yield dbConnection_1.DB.promise().query(`INSERT INTO railway.users (username, email, password, role) VALUES (?, ?, ?, ?)`, [username, email, hashedPass, role]);
                const getNewUser = yield dbConnection_1.DB.promise().query(`SELECT * FROM railway.users WHERE id = ?`, [newUser.insertId]);
                return res.status(200).json((0, errorHandling_1.errorHandling)(getNewUser[0], null));
            }
            else {
                return res.status(400).json((0, errorHandling_1.errorHandling)(null, "Username already exist...!!"));
            }
        }
        return res.status(401).json((0, errorHandling_1.errorHandling)(null, "Unauthorized Access...!"));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "Register User Failed..!! Internal Error!"));
    }
});
exports.registerUserByAdmin = registerUserByAdmin;
