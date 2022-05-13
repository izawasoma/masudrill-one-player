var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.userId);
  if(req.session.userId != undefined){
    msg = "id" + req.session.userId + "さん。こんにちは！";
  }
  else{
    msg = "ゲストさん。こんにちは！";
  }
  res.render('index', { msg: msg });
});

module.exports = router;
