const express = require("express");
require("dotenv").config();
const connected = require("./src/database/connect");
const { signUpChecks } = require("./src/controllers/signupController");
const profileController = require("./src/controllers/profileController");
const loginController = require("./src/controllers/loginController");
const jwtAuth = require("./src/midleware/authJwt");
const wrongPasswordRateLimit = require("./src/midleware/ipRateLimiting");
const profileVisitRateLimit = require("./src/midleware/endPointLimiting");

app = express();

const Redis = require("ioredis");

const redis = new Redis();

const PORT = process.env.PORT || 5000;

if (connected) {
  //signup sectionn
  app.post("/signup", signUpChecks);

  //login section
  app.post("/login", wrongPasswordRateLimit, loginController);

  //profile section
  app.get("/user-profile", jwtAuth, profileVisitRateLimit, profileController);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
} else {
  console.log("app is not connected to database");
}
