const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transaction_id: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = paymentModel;
