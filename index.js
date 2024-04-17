var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
require("dotenv").config();

var path = require("path");
const cors = require("cors");
// const { VerifyToken } = require("./middlewares/VerifyToken.js")

const messageRouter = require("./routes/messages");

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

app.use(cookieParser());
app.use(bodyParser());
app.use("/public", express.static("public"));

///////
app.use("/messages/", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
