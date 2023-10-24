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
exports.logoutUser = exports.loginUser = void 0;
const dbConnection_1 = require("../config/dbConnection");
const errorHandling_1 = require("./errorHandling");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtConfig_1 = __importDefault(require("../config/jwtConfig"));
const node_cache_1 = __importDefault(require("node-cache"));
const failedLoginAttemptsCache = new node_cache_1.default({ stdTTL: 600 });
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield dbConnection_1.DB.promise().query("SELECT * FROM railway.users WHERE email = ?", [email]);
        const failedAttempts = failedLoginAttemptsCache.get(email);
        const user = existingUser[0][0];
        console.log(user, "password:", user.password);
        if (failedAttempts !== undefined && failedAttempts >= 5) {
            return res.status(400).json((0, errorHandling_1.errorHandling)('Too many failed login attempts', null));
        }
        const passwordCheck = yield bcrypt_1.default.compare(password, user.password);
        if (passwordCheck) {
            // Check if the user already has a refresh token
            let refreshToken = req.cookies.refresh_token;
            if (!refreshToken) {
                refreshToken = jsonwebtoken_1.default.sign({ username: user.username, id: user.id, role: user.role }, jwtConfig_1.default, { expiresIn: "7d" });
            }
            const accessToken = jsonwebtoken_1.default.sign({ username: user.username, id: user.id, role: user.role }, jwtConfig_1.default, { expiresIn: "24h" });
            // Reset limit login
            failedLoginAttemptsCache.del(email);
            // Expiration time for tokens
            const accessTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            // Cookies
            res.cookie("access_token", accessToken, {
                expires: accessTokenExpiration,
                httpOnly: true,
            });
            res.cookie("refresh_token", refreshToken, {
                expires: refreshTokenExpiration,
                httpOnly: true,
            });
            return res.status(200).json((0, errorHandling_1.errorHandling)({
                message: `${user.username} Successfully logged in as ${user.role}`,
                data: accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration
            }, null));
        }
        else {
            const newFailedAttempts = (failedAttempts || 0) + 1;
            failedLoginAttemptsCache.set(email, newFailedAttempts);
            return res.status(400).json((0, errorHandling_1.errorHandling)(null, 'Password is incorrect'));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Cannot Connect!! Internal Error!'));
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json();
});
exports.logoutUser = logoutUser;
