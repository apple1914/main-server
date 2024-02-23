const WithdrawValues = require("../models/withdrawValues");
const DepositPrices = require("../models/depositPrices");
const transakApi = require("../api/transak")
const forexApi = require("../api/forex")
const FIAT_LEVELS = [
    1, 2, 3, 5, 7, 10, 15, 20, 30, 50, 75,
    100, 200,
  ];

//
//
//------DEPOSIT RELATED IS BELOW THIS ------
//
//

const addDepositCurrency = async ({ currency }) => {
    const transakFiatCurrencies = await transakApi.fetchFiatCurrencies()
    
    const myTransakFiatCurrency = transakFiatCurrencies.find((currencyInfo) => currencyInfo.symbol === currency)
    if (!myTransakFiatCurrency) {
        return {status:404}
    }
    const allPaymentOptions = myTransakFiatCurrency.paymentOptions
    const myPaymentOptionInfo = allPaymentOptions.find((paymentOption)=>paymentOption.id === "credit_debit_card")
    if (!myPaymentOptionInfo) {
        return {status:400}
    }
    const minAmount = myPaymentOptionInfo.minAmount
    const definition = { currency,lastUpdateAttempt:Date.now(),fiatAmountMinimum:minAmount };
    const newCurrency = new DepositPrices(definition);
    await newCurrency.save();
    return {status:200}
  };

const updateDepositPrice = async ({currency}) => {
    const depositPriceDoc = await DepositPrices.findOne({currency})
    await DepositPrices.findOneAndUpdate({currency},{lastUpdateAttempt: Date.now()})
    const { fiatAmountMinimum } = depositPriceDoc
    const levels = FIAT_LEVELS;//lastUpdateAttempt
    const prices = {};
    for (const multiplier of levels) {
        const fiatAmount = multiplier * fiatAmountMinimum;
        const cryptoAmount = await transakApi.apiFetchDepositPrice({
            currency,
            fiatAmount,
        });
        const price = fiatAmount / cryptoAmount;
        const levelName = multiplier.toFixed(0).toString();
        prices[levelName] = price;
    }
    
    const update = { prices: prices };
    await DepositPrices.findOneAndUpdate({currency},update)
}

const fetchDepositCurrencyForUpdate = async () => {
    const oldestDocs = await DepositPrices.find({}).sort('lastUpdateAttempt').limit(1)
    const oldestDoc = oldestDocs[0]
    return oldestDoc.currency
}


//
//
//------WITHDRAW RELATED IS BELOW THIS ------
//
//


const addWithdrawCurrency = async ({ currency }) => {
    const definition = { currency };
    const newCurrency = new WithdrawValues(definition);
    await newCurrency.save();
    return;
};

const initBatchWithdrawCurrencies = async () => {
    const latestRatesMap = await forexApi.fetchLatestRates()
    for (const [currency, value] of Object.entries(latestRatesMap)) {
        const definition = {currency,value}
        const newCurrency = new WithdrawValues(definition);
        await newCurrency.save();   
    }
    return
};

const updateAllWithdrawValues = async () => {
    const latestRatesMap = await forexApi.fetchLatestRates()
    for (const [currency, value] of Object.entries(latestRatesMap)) {
        try {
            await WithdrawValues.findOneAndUpdate({currency},{value})
        } catch (e) {
            console.log(e)
        }
    }
    return
}



module.exports = {addWithdrawCurrency,addDepositCurrency,updateDepositPrice,updateAllWithdrawValues,fetchDepositCurrencyForUpdate,initBatchWithdrawCurrencies}