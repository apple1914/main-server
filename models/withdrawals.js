const mongoose = require("mongoose");
const { Schema } = mongoose;
const {mainConnection} = require("../connections")

const withdrawalsSchema = new Schema(
  {
    username: String,
    usdtAmount: Number,
    cryptoValue: String,
    withdrawalAddress: {
      type: Schema.Types.ObjectId,
      ref: "WithdrawalAddress",
    },
    completed: { type: Boolean, default: false },
    blockchainTransactionId: String,
  },
  {
    collection: "withdrawals",
    timestamps: true,
  }
);

module.exports = mainConnection.model("Withdrawals", withdrawalsSchema);
