const cloudinary = require("cloudinary").v2;

const { cloudinaryConfigs } = require("./env");

cloudinary.config({
  cloud_name: cloudinaryConfigs.name,
  api_key: cloudinaryConfigs.apiKey,
  api_secret: cloudinaryConfigs.apiSecret,
  secure: true,
});

module.exports = cloudinary;
