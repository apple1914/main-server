const cypherServices = require("./cypher");
// const advcashApi = require("./api/advcash")
const cryptoServices = require("./crypto");
const MERCURYO_WIDGET_ID = "123";
const TRANSAK_API_KEY_PROD = process.env.TRANSAK_API_KEY_PROD;
const TRANSAK_API_KEY_TEST = process.env.TRANSAK_API_KEY_TEST;


const blockchainTransakConventionMapper = {
  bsc: "BSC",
};


const createOnramp = async (input) => {
  const {
    depositId,
    fiatAmount,
    fiatCurrency,
    blockchain,
    address,
    cryptocurrency,
  } = input;
  // const isProd = fiatAmount !== 791
  const isProd = false


  const onrampName = "transak"; //"advcash"
  const onrampPayload = await createTransak({
    depositId,
    fiatAmount,
    fiatCurrency,
    cryptocurrency,
    blockchain,
    address,
    isProd
  });

  return { onrampPayload, onrampName };
};

const createMercuryo = async (input) => {
  const {
    depositId,
    fiatAmount,
    fiatCurrency,
    cryptocurrency,
    blockchain,
    address,
  } = input;

  const signedAddress = cypherServices.sign({
    text: address,
    secret: "harrypotter",
  });
  const widgetId = MERCURYO_WIDGET_ID;

  const mercuryoPayload = {
    depositId: depositId,
    currency: cryptocurrency,
    network: blockchain,
    fiatCurrency: fiatCurrency,
    fiatAmount: fiatAmount,
    address: address,
    signedAddress: signedAddress,
    widgetId: widgetId,
  }; //cuz we just feed this object straight into the widget, best to stick to theri notation here

  return mercuryoPayload;
};

const createTransak = async (input) => {
  const {
    depositId,
    fiatAmount,
    fiatCurrency,
    cryptocurrency,
    blockchain,
    address,isProd
  } = input;

  const environment = isProd ?  "PRODUCTION" : "STAGING"

  const apiKey = isProd === true ? TRANSAK_API_KEY_PROD : TRANSAK_API_KEY_TEST
  console.log(
    "transak blockchain is",
    blockchain,
    blockchainTransakConventionMapper[blockchain]
  );

  const transakSettings = {
    apiKey: apiKey, // Your API Key
    environment: environment, // STAGING/PRODUCTION
    // themeColor: "000000", // App theme color
    // hostURL: window.location.origin,
    // widgetHeight: "700px",
    // widgetWidth: "500px",
    fiatAmount: Number(fiatAmount),
    fiatCurrency: fiatCurrency,
    cryptoCurrencyCode: cryptocurrency,
    network: blockchainTransakConventionMapper[blockchain],
    walletAddress: address,
    // hideExchangeScreen: true,
    // disableWalletAddressForm: true,
    partnerOrderId: depositId,
  };

  return transakSettings;
};

// const createAdvcash = async (input) => {
//     const {depositId,fiatAmount,fiatCurrency,cryptocurrency,blockchain,address} = input
//     const advcashInvoice = await advcashApi.createWithdrawalInvoice({fiatAmount,
//         fiatCurrency,
//         ecurrency:cryptocurrency+"_"+blockchain,
//         depositMethod:"card",
//         receiver:address,
//         depositId,
//         advcashAccountSettings
//     })

//     const url = `wallet.advcash.com/sci/crypto-exchange?ac_account_email=${advcashAccountSettings.accountEmail}&ac_sci_name=${advcashAccountSettings.sciName}&ac_crypto_currency_withdrawal_invoice_id=${advcashInvoice.id}`;
//     const advcashPayload = {
//         ...advcashInvoice,
//         url
//     }
//     return advcashPayload
// }

module.exports = { createOnramp };
