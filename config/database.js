const mongoose = require("mongoose");

const MONGO_DB_LINK = "mongodb://127.0.0.1:27017/";
const DATABASE_NAME = "express-auth";

const MONGODB_URL = `${MONGO_DB_LINK}${DATABASE_NAME}`;

mongoose
  .connect(MONGODB_URL)
  .then((conn) => {
    console.log("Mongoose database connection is made");
  })
  .catch((err) => {
    console.error("Error in connection to mongodb");
  });

module.exports = {
  MONGODB_URL,
  mongoose,
};
