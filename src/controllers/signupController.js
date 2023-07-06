const clientData = require("../database/models/userDocument");
const User = clientData.userDocument;

const checkEmailExistOrUsername = (req, res, next) => {
  const emailCheck = User.findOne({ email: req.body.email });
  const userNameCheck = User.findOne({ name: req.body.name });
  if (emailCheck) {
    return res
      .status(400)
      .json({ status: false, message: "user with this email exist" });
  }
  if (userNameCheck) {
    return res
      .status(400)
      .json({ status: false, message: "username already exist" });
  }
  next();
};
const signUpController = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  user.save((err, user) => {
    if (user) {
      res.status(200).send({ message: "User saved successfully" });
      return;
    } else {
      return err;
    }
  });
};

const signUpChecks = { checkEmailExistOrUsername, signUpController };
module.exports = { signUpChecks };
