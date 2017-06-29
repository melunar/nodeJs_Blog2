/**
 * Created by haoyong on 2017/6/22.
 */

var express = require("express");
var router = express.Router();
var User = require("../models/User.js");
var Content = require("../models/Content.js");
var Category = require("../models/Category.js");
//var Cookies = require("cookies");

var resBody = {};

router.use(function(req, res, next) {
	//req.cookies = new Cookies();
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
			//设置cookie
			try {
				req.cookies.set("userInfo", JSON.stringify({
					_id: userInfo._id,
					username: userInfo.username,
					isAdmin: Boolean(userInfo.isAdmin)
				}));
			} catch(r) {
				console.log(r.toString())
			}

			res.json(resBody);
		});
	}
});
//监听 /api/user 登出
router.get("/user/logout", function(req, res, next) {
	req.cookies.set("userInfo", null);
	resBody.message = "登出成功";
	resBody.data = {};
	res.json(resBody);

});
//添加评论
router.post("/conment/post", function(req, res, next) {
	var contentId = req.body.contentId;
	var postData = {
		username: req.userInfo.username,
		postTime: new Date(),
		content: req.body.content
	};
	Content.findOne({_id: contentId}).then(function(content) {
		content.conments.push(postData);
		return content.save();
	}).then(function(newContent) {
		var data = {content: newContent, userInfo: req.userInfo};
		Category.find().sort({_id: -1}).then(function(cats) {
			console.log(data)
			data.categories = cats;
			res.render("main/view.html", data);
		});

		//这里应该使用ajax请求 TODO
		/*resBody.message = "评论成功";
		resBody.data = postData;
		res.json(postData);*/
		//window.location.reload();
	});

});

module.exports = router;