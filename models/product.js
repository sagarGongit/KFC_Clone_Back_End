const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imgSrc: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    stock: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tag: {
      type: String,
      enum: { values: ["veg", "non-veg"], message: "invalid value" },
      default: "veg",
    },
  },
  { versionKey: false, timestamps: true }
);

const productModel = mongoose.model("Product", ProductSchema);

module.exports = productModel;
