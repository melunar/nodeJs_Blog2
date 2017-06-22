/**
 * Created by haoyong on 2017/6/22.
 */

var express = require("express");
var router = express.Router();

var resBody = {};
router.use(function(req, res, next) {
	resBody = {
		code: 200,
		message: "",
		data: {}
	};
	next();
});


//监听 /api/user
router.post("/user/register", function(req, res, next) {
	//console.log(req.body);
	if(req.body.username === "" || req.body.password === "") {
		resBody.code = 500;
		resBody.message = "请求参数不完整";
		res.json(resBody);
	} else {
		resBody.message = "注册成功";
		resBody.data = req.body;
		res.json(resBody);
	}
});

module.exports = router;