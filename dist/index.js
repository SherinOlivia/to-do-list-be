"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const dbConnection_1 = require("./config/dbConnection");
const superAdminConfig_1 = __importDefault(require("./config/superAdminConfig"));
const mainRouter_1 = __importDefault(require("./router/mainRouter"));
const middleware_1 = __importDefault(require("./middleware"));
const escape_html_1 = __importDefault(require("escape-html"));
// import * as functions from 'firebase-functions';
// import http, { Server } from 'http'
const app = (0, express_1.default)();
const port = process.env.PORT;
// const server: Server = http.createServer(app)
// let PORT: number;
// middleware
(0, middleware_1.default)(app);
// // DB Connection (Railway)
dbConnection_1.DB.connect(function () {
    if (dbConnection_1.DB) {
        console.log("Railway Connection Succeed");
    }
    else {
        console.log("Railway Connection Failed");
    }
}),
    // DB Connection (Local)
    // DBLocal.connect( function () {
    //     if (DBLocal) {
    //         console.log("Localhost Connection Succeed");
    //     } else {
    //         console.log("Localhost Connection Failed");
    //     }
    // })
    // insert Super User / Admin account to Database.. (One time Use)
    (0, superAdminConfig_1.default)();
// router
app.use(mainRouter_1.default);
// Set HTTP keep-alive settings
app.set('keepAliveInitialDelay', 10000);
app.set('enableKeepAlive', true);
app.get('/', (req, res) => {
    const htmlScript = '<script>alert("Caed mil");</script>';
    const escapeHtmlUse = (0, escape_html_1.default)(htmlScript);
    res.send(`<div>${escapeHtmlUse}</div>`);
    console.log(escapeHtmlUse);
});
app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});
// server.listen(0, () => {
//     const address = server.address();
//     if(address && typeof address !== 'string'){
//         PORT = address.port || 6006;
//         console.log(`Server is running on port:${PORT}`)
//     } else {
//         console.error("Server address is not available.")
//     }
// })
// export const week18shbe = functions.https.onRequest(app)
//# sourceMappingURL=index.js.map