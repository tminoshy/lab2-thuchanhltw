const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

module.exports = dbConnect;
