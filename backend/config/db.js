const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gridmind";
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected to Localhost: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ Local MongoDB Connection Failed on ${uri}:`, error.message);
    console.warn("⚠️ GridMind will continue with in-memory persistence fallback.");
  }
};

module.exports = connectDB;
