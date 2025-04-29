const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    state: { type: String, required: true },
    street: { type: String, required: true },
    postalcode: {
      type: String,
      match: /^\d{6}$/,
      required: true,
    },
    country: { type: String, default: "India" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { versionKey: false, timestamps: true }
);

const addressModel = mongoose.model("Address", addressSchema);

module.exports = addressModel;
