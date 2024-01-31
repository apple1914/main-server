const mongoose = require("mongoose");
const { Schema } = mongoose;
const {mainConnection} = require("../connections")

const usersSchema = new Schema(
  {
    username: String,
    utm_campaign: String,
    group: String,
    active: {type:Boolean,default:false},
    email: String,
  },
  {
    collection: "users",
    timestamps: true,
  }
);

module.exports = mainConnection.model("Users", usersSchema);
