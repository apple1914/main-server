var express = require("express");
var router = express.Router();
var path = require("path");
const Users = require("../models/users")
const WithdrawalAddress = require("../models/withdrawalAddress")
const logServices = require("../services/logs")
const { v4: uuidv4 } = require("uuid");
const {handleOnrampsWebhookData} = require("../services/deposits")
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

router.post("/triggerWebhook", async (req, res, next) => {
  const {depositId,cryptocurrency,cryptoValue} = req.body
  await handleOnrampsWebhookData({depositId,cryptocurrency,cryptoValue})
  
  res.sendStatus(200);
});
router.post("/createWithdrawalA", async (req, res, next) => {
  const definition = {
    username:"test",
    address:'test',
    blockchain:"test",
    cryptocurrency:'test',
    nickname:"test"
  }
  const newWA = new WithdrawalAddress(definition)
  await newWA.save()
 
  // logServices.saveOnrampLog({ data:{"yo":"hi"}, depositId:"65dda718dd38ad38050f9b3f",eventName:["buy","paid"].join("-") });


res.sendStatus(200);
});


router.post("/createOnrampLogs", async (req, res, next) => {
  
  logServices.saveOnrampLog({ data:{"yo":"hi"}, depositId:"65dda718dd38ad38050f9b3f",eventName:["buy","paid"].join("-") });


res.sendStatus(200);
});



module.exports = router;
