const mongoose = require("mongoose");
const { Schema } = mongoose;
const {mainConnection} = require("../connections")

const virtualBalancesSchema = new Schema(
  {
    username: String,
    usdtBalance: { type: Number, default: 0.0 },
  },
  {
    collection: "virtualBalances",
    timestamps: true,
  }
);

module.exports = mainConnection.model("VirtualBalances", virtualBalancesSchema);
