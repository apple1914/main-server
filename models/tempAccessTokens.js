const mongoose = require("mongoose");
const { Schema } = mongoose;
const {mainConnection} = require("../connections")

const tempAccessTokensSchema = new Schema(
  {
    name: String,
    value: String,
    expiration: Number,
    isProd:Boolean
  },
  {
    collection: "tempAccessTokens",
    timestamps: true,
  }
);

module.exports = mainConnection.model("TempAccessTokens", tempAccessTokensSchema);
