var express = require('express');
var router = express.Router();
//データベース
const mysql = require('mysql');
const DB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'masudrill',
  multipleStatements: true //★複数クエリの実行を許可する
});

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', {id: "",error: ""});
});

router.post('/login', function(req, res, next) {
  sql = `SELECT * FROM user WHERE loginId = "${req.body.id}" AND pass = "${req.body.pass}";`;
  DB.query(sql, (err, results) => {
    if(err){
      throw err
    }
    else{
      console.log(results.length);
      if(results.length == 0){
        res.render('login',{id: req.body.id,error: "id又はパスワードに誤りがあります"});  
      }
      else{
        req.session.userId = results[0].id;
        res.writeHead(302, {
          'Location': 'http://localhost:3000/room'
        });
        res.end();
      }
    }
  })
});

module.exports = router;
