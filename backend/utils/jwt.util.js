const jwt = require("jsonwebtoken");

function createAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

module.exports = { createAccessToken };
