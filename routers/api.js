/**
 * Created by haoyong on 2017/6/22.
 */

var express = require("express");
var router = express.Router();

//监听 /api/user
router.get("/user", function(req, res, next) {
	res.send("api-user");
});

module.exports = router;