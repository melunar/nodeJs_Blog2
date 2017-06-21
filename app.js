/**
 * Created by haoyong on 2017/6/21.
 * 应用程序启动/入口文件
 */
var express = require("express");
var swig = require("swig");//加载模板引擎
var mongoose = require("mongoose");

//创建app应用 => http.createServer()
var app = express();

//express 设置静态文件托管 =》 public目录
//静态的，直接读取public下的文件放回给客户端
app.use("/public", express.static(__dirname + "/public"));

// 配置模板引擎 engine(模板类型/后缀，解析后的处理函数)
app.engine("html",swig.renderFile);
//配置模板文件的路径 set('views', 路径)
app.set("views", "./views");
//注册模板引擎 set('view engine',模板类型/后缀)
app.set("view engine", "html");
//模板引擎设置 取消模板缓存机制 实现热更新效果
swig.setDefaults({cache: false});


app.use("/admin", require("./routers/admin"));
app.use("/api", require("./routers/api"));
app.use("/", require("./routers/main"));

/*app.get("/", function(req, res, next) {
	//通过路由的方式返回特定的文件或内容个客户端
    //读取配置目录下文件 解析给客户端 render(file, data)
    res.render("index");
    //res.send("<h1>欢迎你</h1>");
});*/
/*app.get("/main.css", function(req, res, next) {
    res.setHeader("content-type", "text/css"); //设置请求文件类型 默认为text/html
    res.send("body {color: red;}");
});*/
mongoose.connect("mongodb://localhost:27017/blog",function(err) {
	if(err) {
		console.log("mongo链接失败");
	} else {
		console.log("mongo链接OK");
	}
});
//监听端口
app.listen(9009);