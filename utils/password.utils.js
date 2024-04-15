const crypto = require("crypto");
const util = require("util");

const pbkdf2Promise = util.promisify(crypto.pbkdf2);

function generateSalt(size) {
  const buffer = crypto.randomBytes(size);
  return buffer.toString("base64");
}

async function createPasswordHash(password, salt) {
  const buffer = await pbkdf2Promise(password, salt, 10000, 64, "sha512");
  return buffer.toString("base64");
}

async function validateUserPassword(actualPassword, hashedPassword, salt) {
  const enteredPasswordHash = await createPasswordHash(actualPassword, salt);
  return enteredPasswordHash === hashedPassword;
}

module.exports = {
  generateSalt,
  createPasswordHash,
  validateUserPassword,
};
