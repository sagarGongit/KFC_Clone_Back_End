const mongoose = require("mongoose");

const Database_Connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connection established");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = Database_Connection;
