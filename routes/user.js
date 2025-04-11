const express = require("express");
const { RegisterUser, UserSignIn, UserLogout } = require("../controllers/user");
const AuthMiddleware = require("../middlewares/auth");
const route = express.Router();

route.post("/register", async (req, res) => {
  try {
    await RegisterUser(req, res);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

route.post("/login", async (req, res) => {
  try {
    await UserSignIn(req, res);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

route.post("/logout", AuthMiddleware, async (req, res) => {
  try {
    await UserLogout(req, res);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = route;
