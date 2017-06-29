/**
 * Created by haoyong on 2017/6/22.
 */
var mongoose = require("mongoose");

//定义并暴露用户表结构
module.exports = new mongoose.Schema({
	category: {//分类
		type: mongoose.Schema.Types.ObjectId, //外键
		ref: "Category" //引用
	},
	user: {//操作人
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	addTime: { //时间
		type: Date,
		default: new Date()
	},
	views: {
		type: Number,
		default: 0
	},
	title: String,
	description: {//简介
		type: String,
		default: ""
	},
	content: {//内容
		type: String,
		default: ""
	},
	conments: {//评论
		type: Array,
		default: []
	}
});