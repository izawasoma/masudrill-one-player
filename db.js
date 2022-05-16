//データベース
const mysql = require('mysql2');
const db_config = {
    /* host: 'localhost',
    user: 'root',
    password: '',
    database: 'masudrill', */
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b1d0824a5f80de',
    password: '9555ba80',
    database: 'heroku_cc6fa88888055ee',
};

function handleDisconnect() {
    console.log('INFO.CONNECTION_DB: ');
    connection = mysql.createConnection(db_config);
    //connection取得
    connection.connect(function(err) {
        if (err) {
            console.log('ERROR.CONNECTION_DB: ', err);
            setTimeout(handleDisconnect, 1000);
        }
        else{
            console.log("正常に接続されました");
        }
    });
    
    //error('PROTOCOL_CONNECTION_LOST')時に再接続
    connection.on('error', function(err) {
        console.log('ERROR.DB: ', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('ERROR.CONNECTION_LOST: ', err);
            handleDisconnect();
        } else {
            throw err;
        }
    });

    return connection;
}

DB = handleDisconnect();

module.exports = DB;