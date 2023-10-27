"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const mysql = __importStar(require("mysql2"));
const dbConfig_1 = require("./dbConfig");
// railway
exports.DB = mysql.createConnection({
    host: dbConfig_1.DBConfig.HOST,
    user: dbConfig_1.DBConfig.USER,
    password: dbConfig_1.DBConfig.PASSWORD,
    database: dbConfig_1.DBConfig.DATABASE,
    port: +dbConfig_1.DBConfig.PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
});
// local
// export const DBLocal = mysql.createConnection({
//     host: DBConfigLocal.HOST,
//     user: DBConfigLocal.USER,
//     password: DBConfigLocal.PASSWORD,
//     database: DBConfigLocal.DATABASE,
// })
