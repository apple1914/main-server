const mongoose = require("mongoose");
const { Schema } = mongoose;
const {mainConnection} = require("../connections")

const cryptoWithdrawalLogsSchema = new Schema(
  {
    data: String,
    blockchainTransactionId: String,
  },
  {
    collection: "cryptoWithdrawalLogs",
    timestamps: true,
  }
);

module.exports = mainConnection.model(
  "CryptoWithdrawalLogs",
  cryptoWithdrawalLogsSchema
);