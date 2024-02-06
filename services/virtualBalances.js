const VirtualBalances = require("../models/virtualBalances");

const fetchVirtualBalanceByUsername = async ({ username }) => {
  console.log("fetching for username:", username);
  const myVirtualBalance = await VirtualBalances.findOne({ username });
  console.log("myVirtualBalanc.e:", myVirtualBalance);

  return myVirtualBalance.usdtBalance;
};

const initializeVirtualBalanceByUsernameIfNone = async ({ username }) => {
  const myVirtualBalance = await VirtualBalances.findOne({ username });
  if (!!myVirtualBalance) {
    return;
  }
  const definition = { username };
  const newVirtualBalance = new VirtualBalances(definition);
  await newVirtualBalance.save();
  return;
};

module.exports = {
  fetchVirtualBalanceByUsername,
  initializeVirtualBalanceByUsernameIfNone,
};
