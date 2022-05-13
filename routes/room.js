var express = require('express');
var router = express.Router();
//データベース
const mysql = require('mysql');

/* GET home page. */
router.get('/room', function(req, res, next) {
  if(req.session.userId == undefined){
    res.writeHead(302, {
      'Location': 'http://localhost:3000/'
    });
    res.end();
  }
  console.log("セッション：" + req.session.userId);
  res.render('room',{user_id:req.session.userId});
});

module.exports = router;
