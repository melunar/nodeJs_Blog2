/**
 * Created by haoyong on 2017/6/22.
 */
var mongoose = require("mongoose");

//定义并暴露用户表结构
module.exports = new mongoose.Schema({
	username: String,// 用户名
	password: String,  //密码
	isAdmin: { //是否管理员
		type: Boolean,
		default: false
	}
});