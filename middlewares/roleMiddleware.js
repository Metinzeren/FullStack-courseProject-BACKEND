const jwt = require("jsonwebtoken");

module.exports = (roles) => {
  return (req, res, next) => {
    const token = req.headers["authorization"] || req.cookies["access_token"];
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    if (roles.includes(decoded.role)) {
      next();
    } else {
      return res.status(401).send("BUNU YAPMAYA YETKİN YOK!");
    }
  };
};
