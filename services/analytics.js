const mixpanelApi = require("../api/mixpanel")
const { v4: uuidv4 } = require("uuid");
const ignoreMxp = process.env.ignoreMxp === "true"

const reportEvent = async ({username,eventName,insertId,userProps}) => {
    if (ignoreMxp == true) return
    await updateUserProps({username,userProps})
    const timestamp = Date.now()
    const result = await mixpanelApi.reportEvent({username,eventName,eventProps:{},insertId:insertId || uuidv4(),timestamp:timestamp})
    console.log("mixpanel reportEvent res", result)
    return
}

const updateUserProps = async ({username,userProps}) => {
    if (ignoreMxp == true) return
    const defaultProps = {hodor:"yes"}
    const myUserProps = !!userProps ? {...userProps,defaultProps} : defaultProps
    const result = await mixpanelApi.identifyUser({username,userProps:myUserProps})
    console.log("mixpanel updaeUserProps res", result)
    return
}



module.exports={reportEvent}