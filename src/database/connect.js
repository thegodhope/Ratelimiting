/* Set up mongoose */
const mongoose = require("mongoose");
const connection = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((error) => {
    console.log("failed to connect");
  });

module.export = connection;
