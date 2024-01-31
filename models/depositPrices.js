const mongoose = require("mongoose");
const { Schema } = mongoose;
const {serverlessConnection} = require("../connections")

const depositPricesSchema = new Schema(
  {
    currency: String,
    prices:Map,
    fiatAmountMinimum:Number,
    lastUpdateAttempt:Date,
  },
  {
    collection: "depositPrices",
    timestamps: true,
  }
);

module.exports = serverlessConnection.model("DepositPrices", depositPricesSchema);
// { 
//   "1.0":Number, 
//   "1.5":Number, 
//   "2.0":Number, 
//   "3.0":Number, 
//   "5.0":Number, 
//   "7.0":Number, 
//   "10.0":Number, 
//   "15.0":Number, 
//   "20.0":Number, 
//   "30.0":Number, 
//   "40.0":Number, 
//   "70.0":Number,
// "100.0":Number},