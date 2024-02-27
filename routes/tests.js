var express = require("express");
var router = express.Router();
var path = require("path");
const Users = require("../models/users")

const UserEvents = require("../models/userEvents")

const { v4: uuidv4 } = require("uuid");

router.post("/createUser", async (req, res, next) => {
    const definition = {
      username:uuidv4(),
      utm_campaign:"testutm",
      email:"teeest@mail.com"
    }
    const newUser = new Users(definition)
    await newUser.save()
  res.sendStatus(200);
});

router.post("/createUserEvent", async (req, res, next) => {
  const definition = {
    username:"someTestUser",
    eventName:"testEvent",
  }
  const newUser = new UserEvents(definition)
  await newUser.save()
res.sendStatus(200);
});



module.exports = router;
