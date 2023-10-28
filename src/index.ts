import express, {Express} from 'express';
import 'dotenv/config';
import { DB } from './config/dbConnection';
import insertAdmin from './config/superAdminConfig';
import router from './router/mainRouter';
import appMiddleware from './middleware';
import escapeHtml from 'escape-html';
// import * as functions from 'firebase-functions';
// import http, { Server } from 'http'

const app: Express = express()
const port = process.env.PORT || 6060;

// const server: Server = http.createServer(app)
// let PORT: number;

// middleware
appMiddleware(app)

// // DB Connection (Railway)
DB.connect( function () {
    if (DB) {
        console.log("Railway Connection Succeed");
    } else {
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
insertAdmin();

// router
app.use(router)

// Set HTTP keep-alive settings
app.set('keepAliveInitialDelay', 10000);
app.set('enableKeepAlive', true);

app.get('/', (req, res) => {
    const htmlScript = '<script>alert("Caed mil");</script>';
    const escapeHtmlUse = escapeHtml(htmlScript);
    res.send(`<div>${escapeHtmlUse}</div>`);
    console.log(escapeHtmlUse)
    })
    

app.listen(port, () => {
    console.log(`Server is running on port:${port}`)
  })


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
