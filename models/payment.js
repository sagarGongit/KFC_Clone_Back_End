const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transaction_id: { type: Number, required: true },
  },
  { versionKey: false, timestamps: true }
);

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = paymentModel;
