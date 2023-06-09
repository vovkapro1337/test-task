const jwt = require("jsonwebtoken");
const secretKey = "vova_secret_key";
const verifyAccessToken = (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ error: "Необхідний accessToken" });
  }

  const token = accessToken.replace("Bearer ", "");

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Недійсний accessToken" });
    }

    req.user = decoded;
    next();
  });
};
module.exports = verifyAccessToken;
