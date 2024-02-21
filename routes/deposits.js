var express = require("express");
var router = express.Router();
const depositServices = require("../services/deposits");
const { VerifyToken } = require("../middlewares/VerifyToken.js");

const isItLocalhost = process.env.NODE_ENV === 'development'
// ---------------------------------IMPORTANT REMINDERS----------------
// 
// 
// 1. ONRAMP isProd IS SET TO FALSE RIGHT NOW!!!! (i.e. it's in test mode rn, activate before launch)
// 2. once you go live, switch transak tests from levii to _test regular
// 
// ---------------------------------
if (isItLocalhost) {
  router.use(VerifyToken);
}


router.post("/", async (req, res, next) => {
 
  const username = isItLocalhost ? req.body.username : req.user?.uid;
  console.log("desposit creat eusername is:", {username})

  const { fiatAmount, fiatCurrency } = req.body;

  const { triggerWithdrawal, withdrawalAddressId } = req.body?.withdrawal;

  if (triggerWithdrawal === true) {
    if (!withdrawalAddressId) {
      res.sendStatus(400);
      return;
    }
  }

  const result = await depositServices.createDeposit({
    username,
    fiatAmount,
    fiatCurrency,
    triggerWithdrawal,
    withdrawalAddressId,
  });
  res.json(result);
});

module.exports = router;
