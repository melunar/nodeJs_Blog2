/**
 * Created by haoyong on 2017/6/22.
 */

var mongoose = require("mongoose");
var Content = require("../schemas/contents.js");

// 根据表结构创建模型类
// <http://mongoosejs.com/docs/api.html#index_Mongoose-model> | Defines a model or retrieves it.
module.exports = mongoose.model("Content", Content);