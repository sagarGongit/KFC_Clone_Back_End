const express = require("express");
const route = express.Router();
const AuthMiddleware = require("../middlewares/auth");
const addressModel = require("../models/address");
const userModel = require("../models/user");

route.get("/get-address", AuthMiddleware, async (req, res) => {
  const user_id = req.id;
  const address = await userModel.find({ _id: user_id }).populate("address");
  if (!address) {
    return res.status(404).json({
      message: "address not found !",
    });
  }
  try {
    res.json({
      message: "address fetched",
      address,
    });
  } catch (error) {
    console.log(error.message);
  }
});

route.post("/addAddress", AuthMiddleware, async (req, res) => {
  const user_id = req.id;
  const { city, state, street, country, postalcode } = req.body;
  try {
    let user = await userModel.findById(user_id).populate("address");
    const newAddress = new addressModel({
      city,
      state,
      street,
      country,
      postalcode,
      user_id,
    });
    await newAddress.save();
    user.address.push(newAddress._id);
    await user.save();
    res.json({
      message: "address added successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

route.patch("/update-address/:id", AuthMiddleware, async (req, res) => {
  const address_id = req.params.id;
  try {
    const update = await addressModel.findByIdAndUpdate(
      address_id,
      { $set: { ...req.body } },
      { new: true }
    );
    res.json({
      message: "address updated successfully",
      update,
    });
  } catch (error) {
    res.status(500).json({
      message: "error occured during updating address",
      error: error.message,
    });
  }
});

route.delete("/remove-address/:id", AuthMiddleware, async (req, res) => {
  const address_id = req.params.id;
  const user_id = req.id;
  try {
    await userModel.updateOne(
      { _id: user_id },
      {
        $pull: { address: address_id },
      }
    );
    const deleted = await addressModel.findByIdAndDelete(address_id);
    res.json({
      message: "address deleted successfully",
      deleted,
    });
  } catch (error) {
    res.status(500).json({
      message: "error occured during deleting address",
      error: error.message,
    });
  }
});

module.exports = route;
