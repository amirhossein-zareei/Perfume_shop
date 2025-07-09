const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

const createCloudinaryStorage = (folder, type = "upload") => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      type,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
  });
};

const publicStorage = createCloudinaryStorage("products_images");
const privateStorage = createCloudinaryStorage(
  "profiles_images",
  "authenticated"
);

const uploadPublicFile = multer({
  storage: publicStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadPrivateFile = multer({
  storage: privateStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = {
  uploadPublicFile,
  uploadPrivateFile,
};
