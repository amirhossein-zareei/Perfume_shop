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

const profileAvatarStorage = createCloudinaryStorage(
  "profiles_avatar",
  "authenticated"
);
const uploadAvatar = multer({
  storage: profileAvatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const productStorage = createCloudinaryStorage("products");
const uploadProductImage = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const iconStorage = createCloudinaryStorage("icons");
const uploadIcon = multer({
  storage: iconStorage,
  limits: { fileSize: 1 * 1024 * 1024 },
});

const brandLogoStorage = createCloudinaryStorage("brands_logos");
const uploadBrandLogo = multer({
  storage: brandLogoStorage,
  limits: { fileSize: 1 * 1024 * 1024 },
});
module.exports = {
  uploadProductImage,
  uploadAvatar,
  uploadIcon,
  uploadBrandLogo,
};
