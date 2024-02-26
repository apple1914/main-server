const mongoose = require("mongoose");
const { Schema } = mongoose;
const {serverlessConnection} = require("../connections")

const withdrawalAddressSchema = new Schema(
  {
    username: String,
    address: String,
    blockchain: String,
    cryptocurrency: String,
    nickname: String,
  },
  {
    collection: "withdrawalAddress",
    timestamps: true,
  }
);

module.exports = serverlessConnection.model("WithdrawalAddress", withdrawalAddressSchema);
