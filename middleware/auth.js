const config = require("config");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  // check for token
  if (!token) res.status(401).send("unauthorized token access");
  try {
    // verify token
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    // add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports = auth;
