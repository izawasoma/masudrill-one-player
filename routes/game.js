var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/game', function(req, res, next) {
  console.log("＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃")
  console.log("▼gameへの接続を確認しました！")
  console.log("＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃＃")
  res.render('game');
});

module.exports = router;
