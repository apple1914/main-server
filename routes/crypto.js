var express = require("express");
var router = express.Router();
const cryptoServices = require("../services/crypto");
const withdrawalServices = require("../services/withdrawals");
const depositServices = require("../services/deposits");

router.post("/createTokenTransfer/:withdrawalId", async (req, res, next) => {
  const { withdrawalId } = req.params;
  await cryptoServices.createTokenTransfer({
    withdrawalId,
  });
  res.sendStatus(200);
});

router.post("/coinCleanUpSuccess/:withdrawalId", async (req, res, next) => {
  const { withdrawalId } = req.params;
  await withdrawalServices.updateWithdrawalById({
    withdrawalId,
    update: { addressCleanUpCompleted: true },
  });
  res.sendStatus(200);
});

router.post("/tokenWithdrawalSuccess/:withdrawalId", async (req, res, next) => {
  //cryptoApis webhook
  const { withdrawalId } = req.params;
  const payload = req.body;
  await withdrawalServices.markWithdrawalSuccess({
    withdrawalId,
    payload,
  });
  res.sendStatus(200);
});

router.post("/mercuryoDepositSuccessWebhook", async (req, res, next) => {
  const payload = req.body;

  await depositServices.processMercuryoWebhook(payload);
  res.sendStatus(200);
});

router.post("/transakDepositSuccessWebhook/development", async (req, res, next) => {
  const payload = req.body.data;
  console.log("FUCKING CHACHACHING! transak is on the line development", payload);
  depositServices.processTransakWebhook({payload,isProd:false});
  res.sendStatus(200);
});

router.post("/transakDepositSuccessWebhook/production", async (req, res, next) => {
  const payload = req.body.data;
  console.log("FUCKING CHACHACHING! transak is on the line production", payload);
  depositServices.processTransakWebhook({payload,isProd:true});
  res.sendStatus(200);
});

module.exports = router;
