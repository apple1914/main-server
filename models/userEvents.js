const mongoose = require("mongoose");
const { Schema } = mongoose;
const {serverlessConnection} = require("../connections")
const analyticServices = require("../services/analytics")

const userEventsSchema = new Schema(
  {
    username: String,
    eventName:String,
  },
  {
    collection: "userEvents",
    timestamps: true,
  }
);

// userEventsSchema.pre('save', function(next) {
//   // Custom logic before saving
//   console.log(`${doc.name} has been saved.`);
//   console.log("saving this doc!!!")
//   next();
// });

userEventsSchema.post('save', function(doc) {
  analyticServices.reportEvent({username:doc.username,eventName:doc.eventName,insertId:doc._id})
});
UserEvents = serverlessConnection.model("UserEvents", userEventsSchema);
// UserEvents.watch().
//   on('change', data => console.log("triggered by change stream",data));

module.exports = UserEvents