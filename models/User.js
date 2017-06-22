/**
 * Created by haoyong on 2017/6/22.
 */

var mongoose = require("mongoose");
var usersSchema = require("../schema/users.js");

//根据表结构创建模型类
module.exports = mongoose.model("User", usersSchema);