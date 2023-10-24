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
exports.refreshTokenRequest = void 0;
const errorHandling_1 = require("./errorHandling");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtConfig_1 = __importDefault(require("../config/jwtConfig"));
const refreshTokenRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json((0, errorHandling_1.errorHandling)(null, 'Refresh token not provided'));
        }
        const decodedToken = jsonwebtoken_1.default.verify(refreshToken, jwtConfig_1.default);
        const accessToken = jsonwebtoken_1.default.sign({
            username: decodedToken.username,
            id: decodedToken.id,
            role: decodedToken.role
        }, jwtConfig_1.default, { expiresIn: '24h' });
        // Set the new access token in the response cookies
        const accessTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        res.cookie('access_token', accessToken, {
            expires: accessTokenExpiration,
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        res.status(200).json((0, errorHandling_1.errorHandling)({
            message: 'Access token refreshed',
            data: accessToken,
            accessTokenExpiration
        }, null));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json((0, errorHandling_1.errorHandling)(null, 'Refresh token is invalid or has expired'));
    }
});
exports.refreshTokenRequest = refreshTokenRequest;
