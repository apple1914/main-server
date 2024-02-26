const mongoose = require("mongoose");
const { Schema } = mongoose;
const {serverlessConnection} = require("../connections")

const depositsSchema = new Schema(
  {
    username: String,
    fiatAmount: Number,
    fiatCurrency: String,
    usdtAmount: Number,
    blockchain: String,
    cryptocurrency: String,
    address: String,
    completed: { type: Boolean, default: false },
    withdrawal: { triggerWithdrawal: Boolean, withdrawalAddressId: String },
  },
  {
    collection: "deposits",
    timestamps: true,
  }
);

module.exports = serverlessConnection.model("Deposits", depositsSchema);
