var express = require("express");
var router = express.Router();
const withdrawalServices = require("../services/withdrawals");
const { VerifyToken } = require("../middlewares/VerifyToken.js");

router.use(VerifyToken);

router.post("/", async (req, res, next) => {
  const username = req.user.uid;
  const { usdtAmount, blockchain, withdrawalAddressId } = req.body;

  if (!usdtAmount) {
    res.sendStatus(400);
    return;
  }
  const { status } = await withdrawalServices.createWithdrawal({
    username,
    withdrawalAddressId,
    usdtAmount,
    blockchain,
  });
  res.sendStatus(status);
});

router.get("/", async (req, res, next) => {
  const username = req.user.uid;
  const result = await withdrawalServices.fetchWithdrawals({ username });
  res.json(result);
});

module.exports = router;
