const jwt = require("jsonwebtoken");


const refresh = (payload) => {
  return jwt.sign(payload, "CYZ8axB206", { expiresIn: "24h" });
};

const access = (payload) => {
  return jwt.sign(payload, "4Tn6534ZiR", { expiresIn: "15m" });
};

module.exports = { refresh, access };
