/**
 * Created by haoyong on 2017/6/22.
 */

var express = require("express");
var router = express.Router();
var Category = require("../models/Category.js");
var Content = require("../models/Content.js");

//监听 /
router.get("/", function(req, res, next) {
	var category = req.query.category || "";
	var data = {
		page: 0, //当前页
		pages: 0, //总页数
		count: 0, //总数
		limit: 3, //每页个数
		category: category, //当前分类
		categories: [],//分类
		contents: [], //文章集
	};
	var where = {};
	//获取分类
	Category.find().sort({_id: -1}).then(function(cats) {
		data.categories = cats;
		if(data.category) {
			where.category = data.category;
		}
		Content.where(where).count().then(function(count) {
			data.count = count;
			data.page = Number(req.query.page || 1);// 0?
			data.pages = Math.ceil(data.count / data.limit);
			data.page = data.page < 1 ? 1 : (data.page > data.pages ? data.pages : data.page);
			if(data.page === 0) { data.page = 1; } // 总数为零 会导致page=0 的bug
			var skip = (data.page - 1) * data.limit;
			return Content.where(where).find().limit(data.limit).skip(skip).populate(["category", "user"]).sort({"addTime": -1});
		}).then(function(contents) {
			data.contents = contents;
			console.log(data)
			data.userInfo = req.userInfo;
			res.render("main/index", data);
		});

	});


});

module.exports = router;