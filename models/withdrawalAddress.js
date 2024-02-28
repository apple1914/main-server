const mongoose = require("mongoose");
const { Schema } = mongoose;
const {serverlessConnection} = require("../connections")
// const onDocCreateServices = require("../services/onDocCreates")

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

// withdrawalAddressSchema.post('save', function(doc) {
//   console.log("XXXXXXXX triggered on save withdrawalAddressSchema")
//   onDocCreateServices.onWithdrawalAddressCreate(doc)
// });
module.exports = serverlessConnection.model("WithdrawalAddress", withdrawalAddressSchema);
