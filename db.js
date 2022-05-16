//データベース
const mysql = require('mysql2');
const db_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'masudrill',
    /* host: 'us-cdbr-east-05.cleardb.net',
    user: 'b1d0824a5f80de',
    password: '9555ba80',
    database: 'heroku_cc6fa88888055ee', */
};

var pool = mysql.createPool(db_config);

module.exports = pool;