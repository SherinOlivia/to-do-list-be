"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConfigLocal = exports.DBConfig = void 0;
require("dotenv/config");
// railway
exports.DBConfig = {
    URL: process.env.SQL_URL,
    HOST: process.env.SQL_HOST,
    USER: process.env.SQL_USERNAME,
    PASSWORD: process.env.SQL_PASSWORD,
    DATABASE: process.env.SQL_DATABASE,
    PORT: process.env.SQL_PORT,
};
// local
exports.DBConfigLocal = {
    HOST: process.env.SQL_HOSTLOCAL,
    USER: process.env.SQL_USERNAMELOCAL,
    PASSWORD: process.env.SQL_PASSWORDLOCAL,
    DATABASE: process.env.SQL_DATABASELOCAL,
};
//# sourceMappingURL=dbConfig.js.map