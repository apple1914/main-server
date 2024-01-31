var express = require("express");
var router = express.Router();
const depositServices = require("../services/deposits");
const { VerifyToken } = require("../middlewares/VerifyToken.js");

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
