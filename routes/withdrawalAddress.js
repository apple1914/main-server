var express = require("express");
var router = express.Router();
const withdrawalAddressServices = require("../services/withdrawalAddress");
const { VerifyToken } = require("../middlewares/VerifyToken.js");

router.use(VerifyToken);

router.get("/", async (req, res, next) => {
  const username = req.user.uid;
  const result = await withdrawalAddressServices.fetchWithdrawalAddresses({
    username,
  });
  res.json(result);
});

router.post("/", async (req, res, next) => {
  const username = req.user.uid;
  // const username = "TEST"
  const { nickname, address, blockchain, cryptocurrency } = req.body;
  console.log("CHAAAAAAAABING!!!!",username)

  const withdrawalAddressId =
    await withdrawalAddressServices.saveWithdrawalAddress({
      username,
      nickname,
      address,
      blockchain,
      cryptocurrency,
    });
  console.log("CHACHACHA!!! CHACHACHA!!! CHACHACHA!!!", {
    withdrawalAddressId,
  });
  res.json({ withdrawalAddressId });
});

module.exports = router;
