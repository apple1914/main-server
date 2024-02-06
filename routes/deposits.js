var express = require("express");
var router = express.Router();
const depositServices = require("../services/deposits");
const { VerifyToken } = require("../middlewares/VerifyToken.js");
// ---------------------------------IMPORTANT REMINDERS----------------
// 
// 
// 1. ONRAMP isProd IS SET TO FALSE RIGHT NOW!!!! (i.e. it's in test mode rn, activate before launch)
// 2. once you go live, switch transak tests from levii to _test regular
// 
// ---------------------------------

router.use(VerifyToken);

router.post("/", async (req, res, next) => {
  const username = req.user.uid;

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
