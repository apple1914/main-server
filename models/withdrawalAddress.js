const mongoose = require("mongoose");
const { Schema } = mongoose;
const {mainConnection} = require("../connections")

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

module.exports = mainConnection.model("WithdrawalAddress", withdrawalAddressSchema);
