const express = require("express");
const dealModel = require("../models/deals");
const AuthMiddleware = require("../middlewares/auth");
const route = express.Router();

route.post("/adddeals", AuthMiddleware, async (req, res) => {
  try {
    const newDeal = req.body.map((deal) => ({
      ...deal,
    }));
    await dealModel.insertMany(newDeal);
    res.json({
      message: "deals added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

route.get("/getDeals", async (req, res) => {
  try {
    const deals = await dealModel.find();
    res.json({
      message: "slide fetched successfully",
      deals,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = route;
