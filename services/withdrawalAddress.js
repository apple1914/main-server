const WithdrawalAddress = require("../models/withdrawalAddress");

const fetchWithdrawalAddresses = async ({ username }) => {
  const addresses = await WithdrawalAddress.find({ username });
  const cleanedUp = addresses.map((withdrawalAddress) => {
    return {
      withdrawalAddressId: withdrawalAddress._id,
      nickname: withdrawalAddress.nickname,
    };
  });
  return cleanedUp;
};

const saveWithdrawalAddress = async ({
  username,
  address,
  blockchain,
  nickname,
  cryptocurrency,
}) => {
  console.log("saving withdrawal address!", {
    username,
    address,
    blockchain,
    nickname,
    cryptocurrency,
  });
  const definition = {
    username,
    address,
    blockchain, //
    nickname,
    cryptocurrency,
  };
  const newWithdrawalAddress = new WithdrawalAddress(definition);
  await newWithdrawalAddress.save();
  return newWithdrawalAddress._id;
};

module.exports = { fetchWithdrawalAddresses, saveWithdrawalAddress };

//must always have at least one be the default withdrawalAddress, NEVER EVER have situation where it is not the case
