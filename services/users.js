const Users = require("../models/users");

const saveUserInfo = async ({ username, miscInfo,contactInfo }) => {
  const {email} = contactInfo
  const definition = {username,email}
  for (const [key, value] of Object.entries(miscInfo)) {
    if (!!value) {
      definition[key] = value
    }
  }  
  const newUser = new Users(definition);
  await newUser.save();
};

const fetchUserInfo = async ({username}) => {
  const myUser = await Users.findOne({username})
  return myUser
}

module.exports = { saveUserInfo,fetchUserInfo };
