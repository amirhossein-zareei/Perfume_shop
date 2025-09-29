const mongoose = require("mongoose");

const { mongoUrl } = require("./env");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoUrl);

    console.log("✅ Successfully connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error-> ", err.message);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
