const mongoose = require("mongoose");
const { Schema } = mongoose;
const {mainConnection} = require("../connections")
const {onOnrampLogsCreate} = require("../services/onDocCreates")

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
  // onOnrampLogsCreate(doc)
  console.log("onramoLogsOnDocCreate triggered")
});

module.exports = mainConnection.model("OnrampLogs", onrampLogsSchema);
