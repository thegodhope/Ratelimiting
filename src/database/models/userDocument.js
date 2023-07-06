const userModel = require("./userModel");
const client = userModel.User;

async function createAndsaveUser(req, res) {
  const userData = client(req.body);
  const saveData = await userData.save();
  res.json(saveData);
}

const userDocument = createAndsaveUser();
module.exports = { userDocument };
