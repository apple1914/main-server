const mongoose = require("mongoose");

const Withdrawals = require("../models/withdrawals");
const WithdrawalAddress = require("../models/withdrawalAddress");
const virtualBalanceServices = require("./virtualBalances");
const cryptoServices = require("./crypto");
const conversionUtils = require("../utils/conversions");
const VirtualBalances = require("../models/virtualBalances");

const createWithdrawal = async (input) => {
  const {
    username,
    withdrawalAddressId, //value to indicate that it can be small or big
    usdtAmount,
  } = input;
  console.log("INPUTS!!------", {
    username,
    withdrawalAddressId,
    usdtAmount,
  });
  if (!withdrawalAddressId) {
    throw new Error("this shouldn't happen");
  }
  if (!usdtAmount) {
    throw new Error("this shouldn't happen");
  }
  //
  const myWithdrawalAddress = await WithdrawalAddress.findById(
    withdrawalAddressId
  );
  console.log("myWithdrawalAddress", myWithdrawalAddress);
  const blockchain = myWithdrawalAddress.blockchain;
  const cryptocurrency = myWithdrawalAddress.cryptocurrency;
  const toAddress = myWithdrawalAddress.address;
  console.log("data for withdraqwal address is :", {
    blockchain,
    cryptocurrency,
    toAddress,
  });

  const usdtBalance =
    await virtualBalanceServices.fetchVirtualBalanceByUsername({ username });
  console.log("= usdtBalance", usdtBalance);

  const __usdtAmount = Math.min(usdtAmount, usdtBalance); //cuz they should never withdraw more than their balance
  console.log("= __usdtAmount", __usdtAmount);

  const cryptoValue = await conversionUtils.convertUsdtToCryptoccurency({
    usdtAmount: __usdtAmount,
    cryptocurrency: myWithdrawalAddress.cryptocurrency,
  });
  console.log("convertUsdtToCryptoccurency cryptoValue", cryptoValue);

  const definition = {
    username,
    withdrawalAddress: myWithdrawalAddress._id,
    usdtAmount: __usdtAmount, //how much should be debited from the virtual baalnce
    cryptoValue: cryptoValue, //instruction for how much crypto to be sent out
  };
  const newWithdrawal = new Withdrawals(definition);
  await newWithdrawal.save();

  const blockchainTransactionId = await cryptoServices.triggerCoinWithdrawal({
    toAddress: toAddress,
    cryptocurrency: cryptocurrency,
    blockchain: blockchain,
    cryptoValue,
  });

  processWithdrawalSuccess({
    withdrawalId: newWithdrawal._id,
    blockchainTransactionId: blockchainTransactionId,
  });

  return { status: 200 };
  //we basically wait for the webhook at this point. meanwhile on the front end we can refresh refresh refresh
};

const fetchWithdrawalById = async ({ withdrawalId }) => {
  const myWithdrawal = await Withdrawals.findById(withdrawalId);
  return myWithdrawal;
};

const updateWithdrawalById = async ({ withdrawalId, update }) => {
  await Withdrawals.findByIdAndUpdate(withdrawalId, update);
  return;
};

const fetchWithdrawals = async ({ username }) => {
  const allMyWithdrawals = await Withdrawals.find({ username });
  return allMyWithdrawals;
};
const processWithdrawalSuccess = async ({
  withdrawalId,
  blockchainTransactionId,
}) => {
  const { username, usdtAmount } = await Withdrawals.findById(withdrawalId);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const negativeUsdtAmount = -1 * usdtAmount;
    await VirtualBalances.findOneAndUpdate(
      { username: username },
      { $inc: { usdtBalance: negativeUsdtAmount } },
      opts
    );

    await Withdrawals.findOneAndUpdate(
      { username: username },
      { completed: true, blockchainTransactionId: blockchainTransactionId },
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

module.exports = {
  createWithdrawal,
  fetchWithdrawalById,
  updateWithdrawalById,
  fetchWithdrawals,
  processWithdrawalSuccess,
};
