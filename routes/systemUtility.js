var express = require("express");
var router = express.Router();
var path = require("path");
const TempAccessTokens = require("../models/tempAccessTokens");
const transakApi = require("../api/transak");

router.post("/refreshTransakToken/:environment", async (req, res, next) => {
  const {environment} = req.params
  const isProd = environment === "production"

  const result = await transakApi.refreshAccessToken({isProd});
  const freshAccessToken = result.accessToken;
  console.log("freshAccessToken transak", freshAccessToken)
  const expiration = result.expiresAt;
  const name = "transak";

  await TempAccessTokens.findOneAndUpdate(
    { name,isProd },
    { value: freshAccessToken, expiration }
  );
  res.sendStatus(200); 
});//NEEDS:CRONJOB

//cryptoapisverifydomain

module.exports = router;
