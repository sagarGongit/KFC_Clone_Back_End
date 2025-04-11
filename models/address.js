const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    state: { type: String, required: true },
    street: { type: String, default: "" },
    postalcode: {
      type: Number,
      match: [/^\d{6}$/, "enter a valid 6 digit code"],
      required: true,
    },
    country: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { versionKey: false, timestamps: true }
);

const addressModel = mongoose.model("Address", addressSchema);

module.exports = addressModel;
