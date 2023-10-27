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
exports.resetPassword = exports.resetPasswordRequest = void 0;
const dbConnection_1 = require("../config/dbConnection");
const errorHandling_1 = require("./errorHandling");
const bcrypt_1 = __importDefault(require("bcrypt"));
const node_cache_1 = __importDefault(require("node-cache"));
const resetPasswordCache = new node_cache_1.default({ stdTTL: 300 });
const resetPasswordRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const existingUser = yield dbConnection_1.DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]);
        const user = existingUser[0][0];
        if (!user) {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, "User not found"));
        }
        const resetKey = Math.random().toString(36).substring(2, 15);
        resetPasswordCache.set(resetKey, email);
        return res.status(200).json((0, errorHandling_1.errorHandling)(`"Password reset Request sent to ${email} with ${resetKey}"`, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "Password reset request failed"));
    }
});
exports.resetPasswordRequest = resetPasswordRequest;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const resetKey = req.query.resetKey;
        const email = resetPasswordCache.get(resetKey);
        if (!email) {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, "Invalid token"));
        }
        const user = yield dbConnection_1.DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]);
        if (!user) {
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, "User not found"));
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield dbConnection_1.DB.promise().query("UPDATE railway.users SET password = ? WHERE email = ?", [hashedPassword, email]);
        resetPasswordCache.del(resetKey);
        return res.status(200).json((0, errorHandling_1.errorHandling)("Password reset success", null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, "Password reset failed"));
    }
});
exports.resetPassword = resetPassword;
//# sourceMappingURL=resetPasswordController.js.map