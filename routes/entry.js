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

/* GET home page */
router.get('/entry', function(req, res, next) {
  let value = {};
  let error = {};
  res.render('entry',{error:error,value:value});
});

router.post('/entry', function(req, res, next) {
  let error = {};
  //エラーチェック
  error.id = notEnterCheck(req.body.id);
  error.pass = notEnterCheck(req.body.pass);
  error.lastName = maxNumberOfCharactersCheck(req.body.lastName,3);
  error.firstName = maxNumberOfCharactersCheck(req.body.firstName,3);
  error.age = notEnterCheck(req.body.age);
  error.info = maxNumberOfCharactersCheck(req.body.info,4);
  error.comment = maxNumberOfCharactersCheck(req.body.comment,10);
  //エラーの個数チェック
  if(errorCount(error)){
    res.render('entry', { 
      error:error,
      value:req.body
    });
  }
  else{
    //sqlの設定
    sql = `INSERT INTO user (loginId,lastName,firstName,age,info,comment,pass) VALUES ("${req.body.id}","${req.body.lastName}","${req.body.firstName}",${req.body.age},"${req.body.info}","${req.body.comment}","${req.body.pass}");`;
    //DBの実行
    DB.query(sql, (err, results) => {
      if(err){
        throw err
      }
      else{
        res.writeHead(302, {
          'Location': 'http://localhost:3000/'
        });
        res.end();
      }
    })
  }
});

module.exports = router;

function notEnterCheck(value){
  if(value == ""){
    return "この項目は必須項目です";
  }
  else{
    return "";
  }
}

function maxNumberOfCharactersCheck(value,maxNum){
  if(value == ""){
    return "この項目は必須項目です";
  }
  else if(value.length > maxNum){
    return "最大文字数は" + maxNum + "文字です";
  }
  else{
    return "";
  }
}

function errorCount(errorObject){
  let count = 0;
  for(let property in errorObject){
    if(errorObject[property] != ""){
      count++;
    }
  }
  if(count > 0){
    return true;
  }
  else{
    return false
  }
}