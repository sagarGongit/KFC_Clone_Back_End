const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const userModel = require("../models/user");
const orderModel = require("../models/order");
const route = express.Router();

route.get("/get-orders", AuthMiddleware, async (req, res) => {
  const user_id = req.id;
  try {
    const orders = await userModel.findById(user_id).populate("orders");
    res.json({ message: "orders fetched successfully!", orders });
  } catch (error) {
    res.status(500).json({
      message: "error occured during adding orders",
      error: error.message,
    });
  }
});

route.delete("/remove-order/:id", async (req, res) => {
  const order_id = req.params.id;
  const user_id = req.id;
  const order = await orderModel.findByIdAndDelete(order_id);
  if (!order) {
    return res.status(404).json({
      message: "order not found",
    });
  }
  try {
    await userModel.updateOne(user_id, {
      $pull: { orders: order_id },
    });
    res.json({
      message: "order deleted successfully !",
    });
  } catch (error) {
    res.status(500).json({
      message: "error occured during removing orders",
      error: error.message,
    });
  }
});

module.exports = route;
