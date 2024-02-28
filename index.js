var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
require('dotenv').config()

var path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
// const { VerifyToken } = require("./middlewares/VerifyToken.js")

const indexRouter = require("./routes/index");
const cryptoRouter = require("./routes/crypto");
const depositRouter = require("./routes/deposits");
const withdrawalRouter = require("./routes/withdrawals");
const withdrawalAddressRouter = require("./routes/withdrawalAddress");
const systemUtilityRouter = require("./routes/systemUtility");
const customerSupportRouter = require("./routes/customerSupport");
const currenciesRouter = require("./routes/currencies");
const userRouter = require("./routes/users");
const testRouter = require("./routes/tests");


const express = require("express");
const app = express();
const port = process.env.PORT || 6000;

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

// app.use(VerifyToken);

app.use(cookieParser());
app.use(bodyParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static("public"));

//mongodb change this one up
// const mongoDB =
// mongoURI
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set("debug", true);
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));

///////
app.use("/", indexRouter);
app.use("/crypto/", cryptoRouter);
app.use("/deposits/", depositRouter);
app.use("/withdrawals/", withdrawalRouter);
app.use("/withdrawalAddress/", withdrawalAddressRouter);
app.use("/systemUtility/", systemUtilityRouter);
app.use("/customerSupport/", customerSupportRouter);
app.use("/currencies/", currenciesRouter);
app.use("/users/", userRouter);
app.use("/tests/",testRouter)
app.get("/", (req, res) => {
  res.send("Hi whatsup!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;

