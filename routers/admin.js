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
				//console.log(categories)
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

//进入编辑分类页面
router.get("/category/edit", function(req, res, next) {
	var id = req.query.id || "";
	Category.findOne({_id: id}).then(function(cat) {
		if(!cat) {
			res.render("admin/error",{
				userInfo: req.userInfo,
				message: "无效删除项",
				url: "/admin/category"
			});
			return Promise.reject();
		}
		//到编辑页
		res.render("admin/category_edit",{
			category: cat,
			userInfo: req.userInfo
		});
	});
});

//编辑分类
router.post("/category/edit", function(req, res, next) {
	var id = req.body.id || "",
		name = req.body.name || "";
	Category.findOne({_id: id}).then(function(cat) {
		if(!cat) {
			res.render("admin/error",{
				userInfo: req.userInfo,
				message: "不存在的分类",
				url: "/admin/category"
			});
			//return;
			return Promise.reject();
		} else {
			if(name === cat.name) {//没有修改
				res.render("admin/success",{
					userInfo: req.userInfo,
					message: "修改成功",
					url: "/admin/category"
				});
				return Promise.reject();
			} else {
				//var car = new Category.findOne({_id: {$ne: id}, name: name});
				//console.log(car)
				return Category.findOne({/*_id: id,*/name: name }); //根据名称查找 判断是否有重名的
			}
		}
	}).then(function(resCat) {
		if(resCat) {//是否名称冲突
			res.render("admin/error",{
				userInfo: req.userInfo,
				message: "存在同名分类",
				url: "/admin/category"
			});
			return Promise.reject();
		}
		return Category.update({_id: id},{name: name});
	}).then(function() {
		res.render("admin/success",{
			userInfo: req.userInfo,
			message: "修改成功",
			url: "/admin/category"
		});
	});
});

//删除分类
router.get("/category/delete", function(req, res, next) {
	var id = req.query.id || "";
	Category.remove({_id: id}).then(function() {
		res.render("admin/success",{
			userInfo: req.userInfo,
			message: "删除成功",
			url: "/admin/category"
		});
	});
});
module.exports = router;