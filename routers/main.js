/**
 * Created by haoyong on 2017/6/22.
 */

var express = require("express");
var router = express.Router();
var Category = require("../models/Category.js");

//监听 /
router.get("/", function(req, res, next) {
	//获取分类
	Category.find().sort({_id: -1}).then(function(cats) {
		//console.log(cats);
		res.render("index",  {
			userInfo: req.userInfo,
			categories: cats
		}); //req.userInfo app.js定义了
	});


});

module.exports = router;