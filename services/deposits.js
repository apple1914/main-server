const Deposits = require("../models/deposits");
const TempAccessTokens = require("../models/tempAccessTokens");

const VirtualBalances = require("../models/virtualBalances");
const onrampServices = require("./onramps");
const withdrawalServices = require("./withdrawals");

const cryptoServices = require("./crypto");
const conversionUtils = require("../utils/conversions");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const virtualBalanceServices = require("./virtualBalances");
const logServices = require("../services/logs");

const DEPOSIT_BLOCKCHAIN = "bsc";

const blockchainToDepositSettings = {
  bsc: {
    cryptocurrency: {
      cryptocurrency: "USDT",
      type: "token",
      contractAddress: "XYZ",
    },
    address: process.env.BSC_DISTRIBUTOR_ADDRESS_PUBLIC_KEY,
  },
};
const createDeposit = async (input) => {
  const {
    username,
    fiatAmount,
    fiatCurrency,
    triggerWithdrawal,
    withdrawalAddressId,
  } = input;



  const blockchain = DEPOSIT_BLOCKCHAIN;
  console.log("deposdit blockc hian is:", blockchain, blockchain === "bsc");
  console.log(
    "blockchainToDepositSettings",
    Object.keys(blockchainToDepositSettings),
    "bsc" in blockchainToDepositSettings
  );
  const depositCryptoSettings = blockchainToDepositSettings[DEPOSIT_BLOCKCHAIN];
  console.log("depositCryptoSettings  is:", depositCryptoSettings);

  const address = depositCryptoSettings.address;
  console.log("address  is:", address);

  const cryptocurrency = depositCryptoSettings.cryptocurrency.cryptocurrency;
  const withdrawal =
    triggerWithdrawal === true
      ? { triggerWithdrawal, withdrawalAddressId }
      : { triggerWithdrawal: false };

  const definition = {
    username,
    fiatAmount,
    fiatCurrency,
    completed: false,
    address: address,
    blockchain: blockchain,
    withdrawal: withdrawal,
    cryptocurrency: cryptocurrency,
  };
  const newDeposit = new Deposits(definition);
  await newDeposit.save();
  const depositId = newDeposit._id;

  const { onrampPayload, onrampName } = await onrampServices.createOnramp({
    depositId,
    fiatAmount,
    fiatCurrency,
    address,
    blockchain,
    cryptocurrency,
  });
  virtualBalanceServices.initializeVirtualBalanceByUsernameIfNone({ username });

  return { depositId, onrampName, onrampPayload };
};

const processMercuryoWebhook = async (payload) => {
  const { merchantTransactionId, amount, currency, type, status } = payload;
  //save the logs here
  if (type != "withdrawal" || status != "completed") {
    return;
  }
  const depositId = merchantTransactionId.slice(0, -2);
  logServices.saveOnrampLog({ payload, depositId });
  await handleOnrampsWebhookData({
    depositId: depositId,
    cryptocurrency: currency.toUpperCase(),
    cryptoValue: amount,
  });

  return;
};

const processTransakWebhook = async ({payload,isProd}) => {
  const tempAccessTokenObj = await TempAccessTokens.findOne({
    name: "transak",isProd
  });
  const acessToken = tempAccessTokenObj.value;
  let decodedPayload;
  try {
    decodedPayload = jwt.verify(payload, acessToken);
  } catch (err) {
    console.log("Err decoding webhook from transak token!", err);
  }
  if (!decodedPayload) {
    return;
  }

  const { eventID, webhookData } = decodedPayload;
  const { status, partnerOrderId, cryptoAmount, cryptoCurrency } = webhookData; //neccesary
  const {
    id,
    walletAddress,
    amountPaid,
    fiatAmount,
    fiatCurrency,
    conversionPrice,
    totalFee,
    referenceCode,
  } = webhookData; //useful for future
  //here you can also save the logs

  logServices.saveOnrampLog({
    payload: { ...webhookData, eventID },
    depositId: partnerOrderId,
  });

  if (status == "COMPLETED" && eventID == "ORDER_COMPLETED") {
    console.log(
      "successs purchase and received crypto!",
      { eventID },
      webhookData
    );
    await handleOnrampsWebhookData({
      depositId: partnerOrderId,
      cryptocurrency: cryptoCurrency,
      cryptoValue: cryptoAmount,
    });
  }
  return;
};

module.exports = {
  createDeposit,
  processMercuryoWebhook,
  processTransakWebhook,
};

const handleOnrampsWebhookData = async ({
  depositId,
  cryptocurrency,
  cryptoValue,
}) => {
  console.log("here at handleOnrampsWebhookData", {
    depositId,
    cryptocurrency,
    cryptoValue,
  });
  const myDeposit = await fetchDepositById({ depositId });

  const usdtAmount = await conversionUtils.parseWebhookCryptoValue({
    cryptoValue: cryptoValue,
    cryptocurrency: cryptocurrency,
  });
  await acidReflectDeposit({ usdtAmount, depositId });

  if (myDeposit.withdrawal.triggerWithdrawal === true) {
    const withdrawalAddressId = myDeposit.withdrawal.withdrawalAddressId;
    await withdrawalServices.createWithdrawal({
      usdtAmount: usdtAmount,
      withdrawalAddressId,
      username: myDeposit.username,
    }); //TEMP_AWAIT
  }
};
const fetchDepositById = async ({ depositId }) => {
  const myDeposit = await Deposits.findById(depositId);
  return myDeposit;
};

const updateDepositById = async ({ depositId, update }) => {
  await Deposits.findByIdAndUpdate(depositId, update); //
  return;
};

const acidReflectDeposit = async ({ usdtAmount, depositId }) => {
  const { username } = await fetchDepositById({ depositId });
  console.log("going to record following deposit", { username, depositId });
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    await VirtualBalances.findOneAndUpdate(
      { username: username },
      { $inc: { usdtBalance: usdtAmount } },
      opts
    );

    await Deposits.findOneAndUpdate(
      { username: username },
      { usdtAmount: usdtAmount, completed: true },
      opts
    );

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// async function updateWallet(userId, amount) {
//   const session = await User.startSession();//
//   session.startTransaction();
//   try {
//     const opts = { session };
//     const A = await User.findOneAndUpdate(
//       { _id: userId },
//       { $inc: { wallet: amount } },
//       opts
//     );

//     const B = await Transaction({
//       usersId: userId,
//       amount: amount,
//       type: "credit",
//     }).save(opts);

//     await session.commitTransaction();
//     session.endSession();
//     return true;
//   } catch (error) {
//     // If an error occurred, abort the whole transaction and
//     // undo any changes that might have happened
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// }

//actually fuck it for easier math, just store crypto amounts as numbers - string are neeeded for tiny numbers only, but we will ever only record stablecoins
