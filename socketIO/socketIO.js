const socketio = require('socket.io');
var pool = require('./../db');

//データベース
/* const mysql = require('mysql');
const DB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'masudrill',
  multipleStatements: true //★複数クエリの実行を許可する
}); */

let gameData = [];

function socketIO(server) {
    const sio = socketio(server);
    sio.on('connection', function (socket) {

        //================================
        //●ルーム参加系処理
        //================================
        socket.on('makeRoom', (roomNum) => {
            gameData[roomNum] = {
                teamMember: {
                    teamName: "",
                    users: []
                },
                quizData: {},
                roomNum: roomNum,
                memberRock: "unrock",
            }
        });

        //=================================
        //
        //=================================
        socket.on('joinRoom', function (memberInfo) {
            //roomNumが有効かどうかのチェック
            if (gameData[memberInfo.roomNum] == undefined) {
                socket.emit("cannotJoinRoom", memberInfo.roomNum);
            }
            else {
                //何人目の参加者かを取得
                let user_count = gameData[memberInfo.roomNum].teamMember.users.length;
                //ユーザー情報を取得し、データを追加
                sql = `SELECT * FROM user WHERE id = ${memberInfo.user_id};`;
                DB.query(sql, (err, results) => {
                    gameData[memberInfo.roomNum].teamMember.users[user_count] = {
                        user_id: memberInfo.user_id,
                        lastName: results[0].lastName,
                        firstName: results[0].firstName,
                        age: results[0].age,
                        info: results[0].info,
                        comment: results[0].comment,
                        socketId: socket.id,
                        state: "ng",
                        order: -1,
                    }
                    //socketのルームに参加
                    socket.join(memberInfo.roomNum);
                    //画面を更新するemit処理
                    sio.to(memberInfo.roomNum).emit("updateMember", gameData[memberInfo.roomNum]);
                    //六人目の場合
                    if (user_count == 5) {
                        for (let i in gameData[memberInfo.roomNum].teamMember.users) {
                            if (i == 0) {
                                sio.to(gameData[memberInfo.roomNum].teamMember.users[i].socketId).emit("parentSetting");
                            }
                            else {
                                sio.to(gameData[memberInfo.roomNum].teamMember.users[i].socketId).emit("childSetting");
                            }
                        }
                    }
                });
            }
        });

        //=================================
        //チーム名を設定した際に飛んでくるイベント
        //=================================
        socket.on("decideTeamName", function (data) {
            //チーム名の更新の更新
            gameData[data.roomNum].teamMember.teamName = data.teamName;
            //チーム名を更新したので、チーム全体へ画面の書き換えを命令する
            sio.to(data.roomNum).emit("decideTeamName", data.teamName);
        });

        //=================================
        //回答者の順番を受信し、データを更新
        //=================================
        let order_count = 1;
        socket.on("decidePlayerOrder", function (data) {
            order_count = 1;
            for (let i in data.player_order) {
                gameData[data.roomNum].teamMember.users[data.player_order[i]].order = order_count;
                order_count++;
            }
            sio.to(data.roomNum).emit("decidePlayerOrder", gameData[data.roomNum]);
        });

        //=================================
        //準備完了ボタンを押したことを受信し、データの書き換え、
        //全員が準備完了状態かをチェックする
        //=================================
        let user_ready_count = 0;
        socket.on("waiting-ready", function (data) {
            console.log("▼送られてきたデータ");
            console.log(data);
            //カウンターの初期化
            user_ready_count = 0;
            //ゲームデータの書き換え
            console.log(gameData[data.roomNum].teamMember.users[data.userData.index].state);
            gameData[data.roomNum].teamMember.users[data.userData.index].state = "ok";
            console.log(gameData[data.roomNum].teamMember.users[data.userData.index].state);
            //全員がokになっているかのチェック
            for (let i in gameData[data.roomNum].teamMember.users) {
                if (gameData[data.roomNum].teamMember.users[i].state == "ok") {
                    user_ready_count++;
                }
            }
            console.log(user_ready_count);
            if (user_ready_count == 6) {
                //全員が準備完了
                sio.to(data.roomNum).emit("waiting-ready", { gameData: gameData[data.roomNum], index: data.userData.index });
                sio.to(data.roomNum).emit("all-member-ready", gameData[data.roomNum]);
            }
            else {
                //全員が準備完了ではない
                sio.to(data.roomNum).emit("waiting-ready", { gameData: gameData[data.roomNum], index: data.userData.index });
            }
        });

        //=================================
        //問題情報を取得する
        //=================================
        socket.on("getQuestionData", function (select_num) {
            //ユーザー情報を取得し、データを追加
            /* sql = `SELECT * FROM quiz_parent WHERE parent_id = ${select_num}; SELECT * FROM quiz_child WHERE parent_id = ${select_num};`;
            DB.query(sql, (err, results) => {
                sio.emit("getQuestionData",{quizParent:results[0],quizChild:results[1]});
            }); */
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
                                sio.emit("getQuestionData",{quizParent:quiz_parent,quizChild:quiz_child});
                            }
                            connection.release();
                        });
                    });
                });
            });
        });

        socket.on("disconnect", function () {
            for (let key in gameData) {
                for (let i in gameData[key].teamMember.users) {
                    console.log(i);
                    if (gameData[key].teamMember.users[i].socketId == socket.id) {
                        i = Number(i);
                        gameData[key].teamMember.users.splice(i, 1);
                        sio.to(gameData[key].roomNum).emit("updateMember", gameData[key]);
                    }
                }
            }
        });
    });
};
module.exports = socketIO;