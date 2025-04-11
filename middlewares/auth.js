const jwt = require("jsonwebtoken");
const tokenModel = require("../models/blacklistedTokens");

const AuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const blacklistToken = await tokenModel.findOne({ token });
  if (blacklistToken) {
    return res.status(409).json({
      message: "session is ended login again",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (token) {
      req.name = decoded.name;
      req.id = decoded.id;
      next();
    } else {
      res.status(401).json({
        message: "access denied unathorized",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = AuthMiddleware;
