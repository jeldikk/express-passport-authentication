const { mongoose } = require("../config/database");

const userSchema = new mongoose.Schema({
  username: String,
  salt: String,
  passwordHash: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
