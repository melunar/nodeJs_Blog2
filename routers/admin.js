/**
 * Created by haoyong on 2017/6/22.
 */

var express = require("express");
var router = express.Router();
var User = require("../models/User.js");

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
			//page = Math.min(page, pages);
			//page = Math.max(page, 1);
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

module.exports = router;