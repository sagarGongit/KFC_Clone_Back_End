const express = require("express");
const orderModel = require("../models/order");
const AuthMiddleware = require("../middlewares/auth");
const route = express.Router();

route.get("/get-orders", AuthMiddleware, async (req, res) => {
  const user_id = req.id;
  try {
    const orders = await orderModel.findOne({ user: user_id });
    res.json({ message: "orders fetched successfully!", orders });
  } catch (error) {
    res.status(500).json({
      message: "error occured during adding orders",
      error: error.message,
    });
  }
});

module.exports = route;
