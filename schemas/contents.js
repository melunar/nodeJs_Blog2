/**
 * Created by haoyong on 2017/6/22.
 */
var mongoose = require("mongoose");

//定义并暴露用户表结构
module.exports = new mongoose.Schema({
	category: {
		type: mongoose.Schema.Types.ObjectId, //外键
		ref: "Category" //引用
	},
	title: String,
	description: {
		type: String,
		default: ""
	},
	content: {
		type: String,
		default: ""
	}
});