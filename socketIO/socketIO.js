const socketio = require('socket.io');
var pool = require('./../db');

function socketIO(server) {
    const sio = socketio(server);
    sio.on('connection', function (socket) {
        //=================================
        //問題情報を取得する
        //=================================
        socket.on("getQuestionData", function (select_num) {
            let quiz_parent;
            let quiz_child;
            pool.getConnection(function (err, connection) {
                new Promise((resolve, reject) => {
                    sql = `SELECT * FROM quiz_parent WHERE parent_id = 1;`;
                    pool.query(sql, (err, results) => {
                        if (err) {
                            console.log("SQLエラー:[quiz_parent]実行に失敗しました");
                            console.log("sql:" + sql);
                            console.log(err);
                            throw err
                        }
                        else {
                            quiz_parent = results;
                            resolve();
                        }
                    });
                }).then(function () {
                    return new Promise((resolve, reject) => {
                        sql = `SELECT * FROM quiz_child WHERE parent_id = 1;`;
                        pool.query(sql, (err, results) => {
                            if (err) {
                                console.log('SQLエラー:[quiz_child]実行に失敗しました');
                                console.log("sql:" + sql);
                                throw err
                            }
                            else {
                                quiz_child = results;
                                console.log(quiz_parent);
                                socket.emit("getQuestionData",{quizParent:quiz_parent,quizChild:quiz_child});
                            }
                            connection.release();
                        });
                    });
                });
            });
        });
    });
};
module.exports = socketIO;