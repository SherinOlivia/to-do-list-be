import * as mysql from 'mysql2'
import { DBConfig } from './dbConfig'

// railway
export const DB = mysql.createConnection({
    host: DBConfig.HOST,
    user: DBConfig.USER,
    password: DBConfig.PASSWORD,
    database: DBConfig.DATABASE,
    port: +DBConfig.PORT!,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
})

// local
// export const DBLocal = mysql.createConnection({
//     host: DBConfigLocal.HOST,
//     user: DBConfigLocal.USER,
//     password: DBConfigLocal.PASSWORD,
//     database: DBConfigLocal.DATABASE,
// })