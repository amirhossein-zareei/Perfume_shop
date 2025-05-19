const mongoose = require("mongoose");

const { mongo } = require("./env");

const connectMongoDB = async () => {
  try {
    const uri = mongo.uri;

    await mongoose.connect(uri);

    console.log("✅ Successfully connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error-> ", err.message);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
