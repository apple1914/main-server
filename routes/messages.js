var express = require("express");
var router = express.Router();

router.get("/", async (req, res, next) => {
  res.json("hellow world message router");
});

module.exports = router;
