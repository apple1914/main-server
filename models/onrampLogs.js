const mongoose = require("mongoose");
const { Schema } = mongoose;
const {mainConnection} = require("../connections")

const onrampLogsSchema = new Schema(
  {
    data: Map,
    depositId: String,
    eventName:String,
  },
  {
    collection: "onrampLogs",
    timestamps: true,
  }
);

onrampLogsSchema.post('save', function(doc) {
  console.log("onramoLogsOnDocCreate triggered")
});

module.exports = mainConnection.model("OnrampLogs", onrampLogsSchema);
