const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    amount: { type: Number, required: true },
    total_items: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  },
  { versionKey: false, timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
