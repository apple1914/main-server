const CryptoWithdrawalLogs = require("../models/cryptoWithdrawalLogs");
const OnrampLogs = require("../models/onrampLogs");

const saveOnrampLog = async ({ data, depositId,eventName }) => {
  const mylogs = new OnrampLogs({
    data: !!data ? data : {},
    depositId,
    eventName:eventName
  });
  await mylogs.save();
};

const saveCryptoWithdrawalLog = async ({
  blockchainTransactionId,
  payload,
}) => {
  const mylogs = new CryptoWithdrawalLogs({
    data: JSON.stringify(payload),
    blockchainTransactionId,
  });
  await mylogs.save();
};
//
module.exports = { saveOnrampLog, saveCryptoWithdrawalLog };
