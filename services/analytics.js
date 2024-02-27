const mixpanelApi = require("../api/mixpanel")
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';

const reportEvent = async ({username,eventName,insertId}) => {
    await updateUserProps({username})
    const timestamp = Date.now()
    const result = await mixpanelApi.reportEvent({username,eventName,eventProps:{},insertId:insertId || uuidv6(),timestamp:timestamp})
    console.log("mixpanel reportEvent res", result)

    return
}

const updateUserProps = async ({username}) => {
    const result = await mixpanelApi.identifyUser({username})
    console.log("mixpanel updaeUserProps res", result)
    return
}

module.exports={reportEvent}