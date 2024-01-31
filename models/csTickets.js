const mongoose = require("mongoose");
const { Schema } = mongoose;
const {mainConnection} = require("../connections")

const csTicketsSchema = new Schema(
  {
    isOpen: Boolean,
    category: String,
    problemText: String,
    email: String,
    solutionText: String,
  },
  {
    collection: "csTickets",
    timestamps: true,
  }
);

module.exports = mainConnection.model("CsTickets", csTicketsSchema);
