/**
 * Created by haoyong on 2017/6/22.
 */

var express = require("express");
var router = express.Router();

//监听 /
router.get("/", function(req, res, next) {
	res.render("index");
});

module.exports = router;