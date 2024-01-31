var express = require("express");
var router = express.Router();
var path = require("path");
const userServices = require("../services/users")

router.post("/saveUserInfo", async (req, res, next) => {
  const {username,miscInfo,contactInfo} = req.body
  await userServices.saveUserInfo({username,miscInfo,contactInfo})
  res.sendStatus(200);
});



module.exports = router;
