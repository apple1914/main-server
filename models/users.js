const mongoose = require("mongoose");
const { Schema } = mongoose;
const {serverlessConnection} = require("../connections")
const onDocCreateServices = require("../services/onDocCreates")
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




usersSchema.post('save', function(doc) {
  console.log("triggered usersSchema func")
  onDocCreateServices.onUserCreate(doc)
});


module.exports = serverlessConnection.model("Users", usersSchema);//


