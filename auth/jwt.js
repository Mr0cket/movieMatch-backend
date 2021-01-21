const jwt = require("jsonwebtoken");
const User = require("../models").user;
const { jwtSecret } = require("../config/secrets");

function toJWT(data) {
  return jwt.sign(data, jwtSecret, { expiresIn: "2h" });
}

function toData(token) {
  return jwt.verify(token, jwtSecret);
}

function userFromToken(token) {
  const data = toData(token);
  return User.findByPk(data.userId);
}

function partyFromId(partyId, currentUserId) {
  if (!partyId) return console.log("party id is not defined");
  return User.findAll({
    where: { partyId, id: { [Op.ne]: currentUserId } },
    attributes: ["id", "name", "email", "partyId"],
  });
}

module.exports = { toJWT, toData, userFromToken, partyFromId };
