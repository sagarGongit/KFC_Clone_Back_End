const mongoose = require("mongoose");

const BlackListSchema = new mongoose.Schema(
  {
    Blacklisted_Tokens: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

const blacklistModel = mongoose.model("BlackList", BlackListSchema);

module.exports = blacklistModel;
