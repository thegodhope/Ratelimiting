const jwt = require("jsonwebtoken");
const config = require("../auth.config");

const verifyToken = (req, res, next) => {
  let bearerHeader = req.headers["authorization"];
  let token = bearerHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userid = decoded.id;
    next();
  });
};

const jwtAuth = verifyToken;
module.exports = { jwtAuth };
