/**
 * Created by haoyong on 2017/6/22.
 */

var express = require("express");
var router = express.Router();
var User = require("../models/User.js");
var Category = require("../models/Category.js");

var resBody = {};

router.use(function(req, res, next) {
	resBody = {
		code: 200,
		message: "",
		data: {}
	};
	next();
});

//监听 /admin/ 主页
router.get("/", function(req, res, next) {
	var userInfo = req.userInfo;
	if(userInfo.isAdmin)
		res.render("admin/index", {userInfo: userInfo});
	else res.send("非管理员禁止访问");
});

// <http://mongoosejs.com/docs/api.html#query_Query-limit> | Specifies the maximum number of documents the query will return.
// <http://mongoosejs.com/docs/api.html#query_Query-skip> | Specifies the number of documents to skip.

//监听 /admin/ 用户管理
router.get("/user", function(req, res, next) {
	var userInfo = req.userInfo;
	if(userInfo.isAdmin) {
		//添加分页
		var pages = 0,
			page = Number(req.query.page || 1),
			limit = 2,
			skip = 0;

		User.count().then(function(count) {
			//console.log(count)
			//取值 （0 - maxPage）
			pages = Math.ceil(count / limit);
			page = page < 1 ? 1 : (page > pages ? pages : page);
			skip = (page - 1) * limit;

			User.find().limit(limit).skip(skip).then(function(users) {
				if(users) {
					//console.log(users);
					res.render("admin/user_index", {
						userInfo: userInfo,
						users: users,

						page: page,
						pages: pages,
						count: count,
						limit: limit
					});
				}
			});
		});
	}
	else res.send("非管理员禁止访问");
});

//分类管理首页
router.get("/category", function(req, res, next) {
	var userInfo = req.userInfo;
	if(userInfo.isAdmin) {
		Category.find().then(function(categories) {
			if(categories) {
				console.log(categories)
				res.render("admin/category_index", {
					userInfo: userInfo,
					categories: categories,
				});
			}
		});
	}
	else res.send("非管理员禁止访问");
});

//添加分类管理页
router.get("/category/add", function(req, res, next) {
	var userInfo = req.userInfo;
	if(userInfo.isAdmin) {
		//添加分页
		res.render("admin/category_add", {userInfo: userInfo});
	}
	else res.send("非管理员禁止访问");
});
//添加分类
router.post("/category/add", function(req, res, next) {
	var name = req.body.name,
		userInfo = req.userInfo;
	if(name === "") {
		resBody.code = 500;
		resBody.message = "名称不能为空";
		res.render("admin/error", {url: "/admin/category/add", message: resBody.message, userInfo: userInfo});
		//res.json(resBody);
	} else {
		Category.findOne({name: name}).then(function(cat) {
			if(cat) {
				resBody.message = "'" + name + "'" + "分类已存在";
				res.render("admin/error", {url: "/admin/category/add", message: resBody.message,userInfo: userInfo});
				return Promise.reject();
			}
			return new Category({ name: name }).save();
		}).then(function(newCat) {
			resBody.message = "'" + name + "'" + "分类添加成功";
			resBody.data = newCat;
			//res.json(resBody);
			res.render("admin/success", {url: "/admin/category", message: resBody.message, userInfo: userInfo});
		});
	}
});


module.exports = router;