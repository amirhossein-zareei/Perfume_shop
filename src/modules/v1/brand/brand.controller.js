const { Brand } = require("../../../models/index");
const { sendSuccessResponse } = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");

exports.createBrand = async (req, res, next) => {
  try {
    const { name, content, website } = req.body;
    const logoFile = req.file;

    if (!logo) {
      throw new AppError("Brand logo is required.", 400);
    }

    const isBrandNameExist = await Brand.exists({ name });

    if (isBrandNameExist) {
      throw new AppError("A brand whit this name already exists.", 409);
    }

    const newBrand = new Brand({
      name,
      logo,
      content,
      website,
      logo: {
        url: logoFile.url,
        publicId: logoFile.public_id,
      },
    });

    await newBrand.save();

    return sendSuccessResponse(res, "Brand created successfully.", newBrand);
  } catch (err) {
    next(err);
  }
};
