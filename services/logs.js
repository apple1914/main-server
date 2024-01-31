const CryptoWithdrawalLogs = require("../models/cryptoWithdrawalLogs");
const OnrampLogs = require("../models/onrampLogs");

const saveOnrampLog = async ({ payload, depositId }) => {
  const mylogs = new OnrampLogs({
    data: JSON.stringify(payload),
    depositId,
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

module.exports = { saveOnrampLog, saveCryptoWithdrawalLog };
