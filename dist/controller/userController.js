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
exports.updateUser = exports.getOneUser = exports.userProfile = exports.getAllClient = exports.getAllStaff = void 0;
const dbConnection_1 = require("../config/dbConnection");
const errorHandling_1 = require("./errorHandling");
// Admin Only!
const getAllStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUser = yield dbConnection_1.DB.promise().query('SELECT * FROM railway.users WHERE role = ?', ["staff"]);
        if (!allUser) {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, "User Data Unavailable..."));
        }
        else {
            return res.status(200).json((0, errorHandling_1.errorHandling)(allUser[0], null));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "User Data Retrieval Failed...!!"));
    }
});
exports.getAllStaff = getAllStaff;
// Staff & Admin only!
const getAllClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientsData = yield dbConnection_1.DB.promise().query('SELECT * FROM railway.users WHERE role = ?', ["client"]);
        if (!clientsData) {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, "User Data Unavailable..."));
        }
        else {
            return res.status(200).json((0, errorHandling_1.errorHandling)(clientsData[0], null));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "User Data Retrieval Failed...!!"));
    }
});
exports.getAllClient = getAllClient;
// get user by ID aka profile ===> automatically shows specific user their profile (including staff & admin)
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const userId = user.id;
            const userData = yield dbConnection_1.DB.promise().query('SELECT * FROM railway.users WHERE id = ?', [userId]);
            return res.status(200).json((0, errorHandling_1.errorHandling)(userData[0], null));
        }
        return res.status(400).json((0, errorHandling_1.errorHandling)(null, "User Data Not Found..."));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "User Data Retrieval Failed...!!"));
    }
});
exports.userProfile = userProfile;
// get user by ID =>>> staff & admin can check specific users, client can only see their own
const getOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, id } = req.user;
        const checkId = req.params.id;
        if (role == "staff" || role == "admin") {
            const userData = yield dbConnection_1.DB.promise().query('SELECT * FROM railway.users WHERE id = ?', [checkId]);
            return res.status(200).json((0, errorHandling_1.errorHandling)(userData[0], null));
        }
        else if ((role !== "staff" && role !== "admin") && id == checkId) {
            const userData = yield dbConnection_1.DB.promise().query('SELECT * FROM railway.users WHERE id = ?', [id]);
            return res.status(200).json((0, errorHandling_1.errorHandling)(userData[0], null));
        }
        else {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, "User Data Not Found..."));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "User Data Retrieval Failed...!!"));
    }
});
exports.getOneUser = getOneUser;
// name, city, about_me
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, id } = req.user;
        const checkId = req.params.id;
        const { name, city, about_me } = req.body;
        if ((role !== "staff" && role !== "admin") && id == checkId) {
            yield dbConnection_1.DB.promise().query(`
                UPDATE railway.users
                SET name = ?, city = ?, about_me = ? 
                WHERE id = ?`, [name, city, about_me, id]);
            const updatedData = yield dbConnection_1.DB.promise().query(`
                SELECT * FROM railway.users
                WHERE id = ?`, [checkId]);
            res.status(200).json((0, errorHandling_1.errorHandling)({
                message: "User Data Updated Successfully",
                data: updatedData[0]
            }, null));
        }
        else if (role == "staff" || role == "admin") {
            yield dbConnection_1.DB.promise().query(`
                UPDATE railway.users
                SET name = ?, city = ?, about_me = ? 
                WHERE id = ?`, [name, city, about_me, checkId]);
            const updatedData = yield dbConnection_1.DB.promise().query(`
                SELECT * FROM railway.users
                WHERE id = ?`, [checkId]);
            return res.status(200).json((0, errorHandling_1.errorHandling)({
                message: "User Data Updated Successfully",
                data: updatedData[0]
            }, null));
        }
        else {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, "Unauthorized Update...!! Update Failed!!"));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "User Data Update Failed...!!"));
    }
});
exports.updateUser = updateUser;
//# sourceMappingURL=userController.js.map