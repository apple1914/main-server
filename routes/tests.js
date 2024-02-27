var express = require("express");
var router = express.Router();
var path = require("path");
const UserEvents = require("../models/userEvents")

router.post("/testUserEventsStream", async (req, res, next) => {
    const username = "test"
    const eventName = "signup"
    const newUserEvent = new UserEvents({username,eventName})
    await newUserEvent.save()
  res.sendStatus(200);
});



module.exports = router;
