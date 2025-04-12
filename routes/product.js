const express = require("express");
const productModel = require("../models/product");
const AuthMiddleware = require("../middlewares/auth");
const route = express.Router();

route.post("/addProduct/:category_id", AuthMiddleware, async (req, res) => {
  const category_id = req.params.category_id;
  try {
    const product = req.body.map((products) => ({
      ...products,
      category: category_id,
    }));
    const newProduct = await productModel.insertMany(product);
    res.json({
      message: "product added successfully !",
      newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

route.get("/get-product", async (req, res) => {
  try {
    const products = await productModel.find().populate("category");
    res.json({
      message: "product fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = route;
