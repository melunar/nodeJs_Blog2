/**
 * Created by haoyong on 2017/6/22.
 */

var express = require("express");
var router = express.Router();

//监听 /
router.get("/", function(req, res, next) {
	var data = { userInfo: req.userInfo };
	res.render("index", data); //req.userInfo app.js定义了
});

module.exports = router;