const express = require("express");
const categoryModel = require("../models/menuCategories");
const route = express.Router();

route.post("/addCategory", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newCategory = new categoryModel({
      title,
      description,
    });
    await newCategory.save();
    res.json({
      message: "category added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = route;
