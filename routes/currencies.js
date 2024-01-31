var express = require("express");
var router = express.Router();
const currencyServices = require("../services/currencies")


router.post("/addWithdrawCurrency/:currency", async (req, res, next) => {
    const { currency } = req.params;
    await currencyServices.addWithdrawCurrency({ currency });
    res.sendStatus(200);
});

router.post("/addDepositCurrency/:currency", async (req, res, next) => {
    const { currency } = req.params;
    const {status} = await currencyServices.addDepositCurrency({ currency });
    res.sendStatus(status || 200);
});

router.post("/updateDepositPriceForOne", async (req, res, next) => {
    const currencyForDepositPriceUpdate = await currencyServices.fetchDepositCurrencyForUpdate()
    await currencyServices.updateDepositPrice({ currency:currencyForDepositPriceUpdate });
    res.sendStatus(200);
});//NEEDS:CRONJOB

router.post("/initBatchWithdrawCurrencies", async (req, res, next) => {
    await currencyServices.initBatchWithdrawCurrencies();
    res.sendStatus(200);
});

router.post("/updateAllWithdrawValues", async (req, res, next) => {
    await currencyServices.updateAllWithdrawValues();
    res.sendStatus(200);
});//NEEDS:CRONJOB

  
module.exports = router;
