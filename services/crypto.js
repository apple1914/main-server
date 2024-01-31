const web3Apis = require("../api/web3Api");

const blockchainToWithdrawalSettings = {
  bsc: {
    fromAddress: process.env.BSC_DISTRIBUTOR_ADDRESS_PUBLIC_KEY,
    fromAddressPrivateKey: process.env.BSC_DISTRIBUTOR_ADDRESS_PRIVATE_KEY,
  },
};
const triggerCoinWithdrawal = async ({
  //assume we only ever withdraw coins
  toAddress,
  blockchain,
  cryptoValue,
}) => {
  console.log("toAddress", toAddress);

  console.log("blockchain", blockchain);

  const withdrawalCryptoSettings = blockchainToWithdrawalSettings[blockchain];

  console.log("cryptoValue", cryptoValue);

  const transactionHash = await web3Apis.sendCoins({
    fromAddress: withdrawalCryptoSettings.fromAddress,
    privateKey: withdrawalCryptoSettings.fromAddressPrivateKey,
    toAddress,
    cryptoValue,
    blockchain,
  });
  console.log("transactionHash", transactionHash);

  //   await subscribeToTransactionConfirmedWebhook({
  //     blockchain,
  //     blockchainTransactionId,
  //   });

  return transactionHash;
};

module.exports = { triggerCoinWithdrawal };
