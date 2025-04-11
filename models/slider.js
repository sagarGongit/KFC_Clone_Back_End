const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "description placeholder" },
    imgSrc: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png",
    },
  },
  { versionKey: false, timestamps: true }
);

const sliderModel = mongoose.model("Slider", sliderSchema);

module.exports = sliderModel;
