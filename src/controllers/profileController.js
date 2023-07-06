const clientData = require("../database/models/userDocument");
const User = clientData.userDocument;

const profile = (req, res) => {
  const user = User.find({
    username: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  if (!user) {
    return res.status(503).json({ status: false, message: "User not found" });
  } else {
    return res.status(200).json({
      status: true,
      message: "User profile exists",
      data: user,
    });
  }
};

const profileController = profile;
module.exports = { profileController };
