const mariadb = require('mariadb');

const conn = mariadb.createPool({
    host: process.env.MARIADB_HOST,
    user: process.env.MARIADB_USER,
    database: process.env.MARIADB_DB,
    password: process.env.MARIADB_USER_PWD,
    ssl: { rejectUnauthorized: false }
})

module.exports = conn;