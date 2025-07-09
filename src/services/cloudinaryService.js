const cloudinary = require("../config/cloudinary");

const deleteFiles = async (publicIds, type = "upload") => {
  try {
    if (!publicIds || (Array.isArray(publicIds) && publicIds.length === 0)) {
      return false;
    }

    const idsToDelete = Array.isArray(publicIds) ? publicIds : [publicIds];

    await cloudinary.api.delete_resources(idsToDelete, {
      type,
      resource_type: "image",
    });

    return true;
  } catch (err) {
    throw err;
  }
};

const generateSignedUrl = (publicId) => {
  return cloudinary.url(publicId, {
    type: "authenticated",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
  });
};

module.exports = {
  deleteFiles,
  generateSignedUrl,
};
