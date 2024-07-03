const mysql = require('mysql2/promise')

const mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 1,
    maxIdle: 1,
    idleTimeout: 60,
    queueLimit: 0
});

mysqlPool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});
mysqlPool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

module.exports = mysqlPool;