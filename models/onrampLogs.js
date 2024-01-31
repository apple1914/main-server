const mongoose = require("mongoose");
const { Schema } = mongoose;
const {mainConnection} = require("../connections")

const onrampLogsSchema = new Schema(
  {
    data: String,
    depositId: String,
  },
  {
    collection: "onrampLogs",
    timestamps: true,
  }
);

module.exports = mainConnection.model("OnrampLogs", onrampLogsSchema);
