/**
 * Created by haoyong on 2017/6/22.
 */

var express = require("express");
var router = express.Router();
var User = require("../models/User.js");

var resBody = {};
router.use(function(req, res, next) {
	resBody = {
		code: 200,
		message: "",
		data: {}
	};
	next();
});


//监听 /api/user 注册
router.post("/user/register", function(req, res, next) {
	//console.log(req.body);

	if(req.body.username === "" || req.body.password === "") {
		resBody.code = 500;
		resBody.message = "请求参数不完整";
		res.json(resBody);
	} else {
		//根据数据库查询用户是否已经被注册
		var username = req.body.username;
		var password = req.body.password;
		// <http://mongoosejs.com/docs/api.html#model_Model.findOne> | Finds one document.
		User.findOne({
			username: username
		}).then(function(userInfo) {
			if(userInfo) {
				resBody.code = 400;
				resBody.message = "该用户已被注册";
				resBody.data = userInfo;
				res.json(resBody);
				return;
			}
			var user = new User();
			user.username = username;
			user.password = password;
			return user.save(); //保存一条数据到数据库
		}).then(function(newUserInfo) {
			resBody.message = "注册成功";
			resBody.data = newUserInfo;
			res.json(resBody);
		});
	}
});
//监听 /api/user 登录
router.post("/user/login", function(req, res, next) {
	if(req.body.username === "" || req.body.password === "") {
		resBody.code = 500;
		resBody.message = "用户名密码不能为空";
		res.json(resBody);
	} else {
		var username = req.body.username;
		var password = req.body.password;
		// <http://mongoosejs.com/docs/api.html#model_Model.findOne> | Finds one document.
		User.findOne({
			username: username,
			password: password
		}).then(function(userInfo) {
			if(!userInfo) {
				resBody.code = 400;
				resBody.message = "未注册的用户或密码错误";
				res.json(resBody);
				return;
			}
			resBody.message = "登录成功";
			resBody.data = userInfo;
			res.json(resBody);
		});
	}
});

module.exports = router;