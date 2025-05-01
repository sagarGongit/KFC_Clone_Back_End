const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: [3, "atleast 3 charecter required"],
      max: [20, "charecter not exceeds more than 20"],
    },
    email: {
      type: String,
      match: /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      match: /^([+]\d{2})?\d{10}$/,
      required: true,
    },
    password: {
      type: String,
      min: [5, "atleast 5 charecter required"],
      max: [25, "not exceed more than 25 charecters"],
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  },
  { versionKey: false, timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
