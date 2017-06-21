/**
 * Created by haoyong on 2017/6/22.
 */

var express = require("express");
var router = express.Router();

//监听 /admin/user
router.get("/user", function(req, res, next) {
	res.send("admin-user");
});

module.exports = router;