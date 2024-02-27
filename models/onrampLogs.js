const mongoose = require("mongoose");
const { Schema } = mongoose;
const {mainConnection} = require("../connections")
const onDocCreateServices = require("../services/onDocCreates")

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
  onDocCreateServices.onOnrampLogsCreate(doc)
});

module.exports = mainConnection.model("OnrampLogs", onrampLogsSchema);
