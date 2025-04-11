const express = require("express");
const cartModel = require("../models/cart");
const AuthMiddleware = require("../middlewares/auth");
const userModel = require("../models/user");
const route = express.Router();

route.post("/addCart/:product_id", AuthMiddleware, async (req, res) => {
  const productid = req.params.product_id;
  const user_id = req.id;
  try {
    const user = await userModel.findById(user_id).populate("cart");
    let cart = user.cart;
    if (!cart) {
      cart = await cartModel.create({
        user: user_id,
        items: [],
      });
      user.cart = cart._id;
      await user.save();
    }
    let check = cart.items.findIndex(
      (idx) => idx.product.toString() == productid
    );
    if (check > -1) {
      cart.items[check].quantity += 1;
    } else {
      cart.items.push({ product: productid, quantity: 1 });
    }
    await cart.save();
    res.json({
      message: "item added to the cart",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

route.get("/get-cartItems", AuthMiddleware, async (req, res) => {
  const user_id = req.id;
  const items = await cartModel
    .find({ user: user_id })
    .populate("items.product");
  if (!items) {
    return res.status(404).json({
      message: "Your Cart Is Empty!",
    });
  }
  try {
    res.json({
      message: "cart items fetched successfully",
      items,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

route.delete("/remove-item/:id", AuthMiddleware, async (req, res) => {
  const item_id = req.params.id;
  const user_id = req.id;
  try {
    const item = await cartModel.updateOne(
      {
        user: user_id,
      },
      { $pull: { items: { _id: item_id } } }
    );
    if (item.modifiedCount == 0) {
      return res.status(404).json({
        message: "item not found item not deleted !",
      });
    }
    res.json({
      message: "item deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = route;
