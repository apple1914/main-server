const analyticServices = require("./analytics")
const depositServices = require("./deposits")

const onUserCreate = async (doc) => {
    console.log("triggered: onUserCreate")
    await analyticServices.reportEvent({username:doc.username,eventName:"signup",insertId:doc._id,userProps:{utm_campaign:doc.utm_campaign}})
}

const onWithdrawalAddressCreate = async (doc) => {
    console.log("triggered: onWithdrawalAddressCreate")

    await analyticServices.reportEvent({username:doc.username,eventName:"add-wiithdrawal-address",insertId:doc._id})
}

const onDepositCreate = async (doc) => {
    console.log("triggered: onDepositCreate")

    await analyticServices.reportEvent({username:doc.username,eventName:"create-deposit",insertId:doc._id})
}

const onOnrampLogsCreate = async (doc) => {
    console.log("triggered: onOnrampLogsCreate")

    const myDeposit = await depositServices.fetchDepositById({ depositId:doc._id });
    const username = myDeposit.username
    const eventName = doc.eventName
    await analyticServices.reportEvent({username:username,eventName:eventName,insertId:doc._id})
}


module.exports = {onUserCreate,onWithdrawalAddressCreate,onDepositCreate,onOnrampLogsCreate}