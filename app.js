/**
 * Created by haoyong on 2017/6/21.
 * 应用程序启动/入口文件
 */

var express = require("express");
var swig = require("swig");//加载模板引擎

//创建app应用 => http.createServer()
var app = express();

// 配置模板引擎 engine(模板类型/后缀，解析后的处理函数)
app.engine("html",swig.renderFile);
//配置模板文件的路径 set('views', 路径)
app.set("views", "./views");
//注册模板引擎 set('view engine',模板类型/后缀)
app.set("view engine", "html");
//模板引擎设置 取消模板缓存机制 实现热更新效果
swig.setDefaults({cache: false});


app.get("/", function(req, res, next) {
    //读取配置目录下文件 解析给客户端 render(file, data)
    res.render("index");
    //res.send("<h1>欢迎你</h1>");
});

//监听端口
app.listen(9009);
