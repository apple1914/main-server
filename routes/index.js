var express = require("express");
var router = express.Router();
var path = require("path");

router.get("/", async (req, res, next) => {
  res.sendStatus(200);
});



module.exports = router;