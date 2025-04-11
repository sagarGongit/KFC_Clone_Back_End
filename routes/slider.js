const express = require("express");
const sliderModel = require("../models/slider");
const AuthMiddleware = require("../middlewares/auth");
const route = express.Router();
route.use(AuthMiddleware);

route.post("/addSlides", async (req, res) => {
  try {
    const newSlide = req.body.map((slide) => ({
      ...slide,
    }));
    await sliderModel.insertMany(newSlide);
    res.json({
      message: "slides added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

route.get("/getSlide", async (req, res) => {
  try {
    const slides = await sliderModel.find();
    res.json({
      message: "slide fetched successfully",
      slides,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = route;
