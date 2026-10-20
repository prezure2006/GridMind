const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb is connected");
  } catch (error) {
    console.log("❌ DB Connection Error:", error);
    process.exit(1);
  }
};
module.exports = connectDB;
