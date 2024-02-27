const mixpanelApi = require("../api/mixpanel")
const { v4: uuidv4 } = require("uuid");
const ignoreMxp = process.env.ignoreMxp === "true"

const reportEvent = async ({username,eventName,insertId}) => {
    if (ignoreMxp == true) return
    await updateUserProps({username})
    const timestamp = Date.now()
    const result = await mixpanelApi.reportEvent({username,eventName,eventProps:{},insertId:insertId || uuidv4(),timestamp:timestamp})
    console.log("mixpanel reportEvent res", result)
    return
}

const updateUserProps = async ({username}) => {
    if (ignoreMxp == true) return
    const userProps = {hodor:"yes"}
    const result = await mixpanelApi.identifyUser({username,userProps})
    console.log("mixpanel updaeUserProps res", result)
    return
}

module.exports={reportEvent}