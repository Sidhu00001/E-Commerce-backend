const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected successfully".bgGreen.white);
  } catch (err) {
    console.log(`Database connection failed: ${err.message}`.bgRed.white);
  }
};
module.exports = connectDB;
