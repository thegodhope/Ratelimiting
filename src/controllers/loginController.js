const clientData = require("../database/models/userDocument");
const User = clientData.userDocument;
const jwt = require("jsonwebtoken");
const config = require("../auth.config");

const login = (req, res) => {
  const registeredUser = User.findOne({
    username: req.body.username,
  });
  if (!registeredUser) {
    return res.status(404).send({ message: "User Not found." });
  }
  if (registeredUser.password != req.body.pasword) {
    return res.status(401).send({ message: "Invalid Password!" });
  }

  const payload = {
    id: registeredUser._id,
    username: registeredUser.username,
    email: registeredUser.email,
  };
  const token = jwt.sign({ payload }, config.secret, {
    expiresIn: config.expire,
  });

  return res.status(200).json({
    status: true,
    message: "login successfull",
    data: {
      ...payload,
      token,
    },
  });
};

const loginController = login;
module.exports = loginController;
