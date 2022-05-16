var express = require('express');
var router = express.Router();
var pool = require('./../db');

/* GET home page */
router.get('/sample_mysql2', function (req, res, next) {
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
          connection.release();
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
            res.render('sample_mysql2', { quiz_data: quiz_child });
          }
          connection.release();
        });
      });
    });
  });
});

module.exports = router;