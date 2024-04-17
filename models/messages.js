const mongoose = require("mongoose");
const { Schema } = mongoose;
const { mainConnection } = require("../connections");

const messageSchema = new Schema(
  {
    body: String,
    username: String,
    senderRole: String,
  },
  {
    collection: "messages",
    timestamps: true,
  }
);

module.exports = mainConnection.model("Messages", messageSchema);
