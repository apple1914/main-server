const mongoose = require("mongoose");
const { Schema } = mongoose;
const {serverlessConnection} = require("../connections")

const withdrawValuesSchema = new Schema(
  {
    currency: String,
    value: Number,
  },
  {
    collection: "withdrawValues",
    timestamps: true,
  }
);

module.exports = serverlessConnection.model("WithdrawValues", withdrawValuesSchema);