const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"] || req.cookies["access_token"];

  if (!token) {
    return res.status(401).send({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Failed to authenticate token." });
  }
};

module.exports = verifyToken;
