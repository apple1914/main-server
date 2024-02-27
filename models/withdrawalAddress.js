const mongoose = require("mongoose");
const { Schema } = mongoose;
const {serverlessConnection} = require("../connections")
const onDocCreateServices = require("../services/onDocCreates")

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

withdrawalAddressSchema.post('save', function(doc) {
  onDocCreateServices.onWithdrawalAddressCreate(doc)
});