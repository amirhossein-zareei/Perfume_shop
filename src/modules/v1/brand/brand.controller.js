const { Brand } = require("../../../models/index");
const APIFeatures = require("../../../utils/apiFeatures");
const sendSuccessResponse = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");

exports.createBrand = async (req, res, next) => {
  try {
    const { name, content, website } = req.body;
    const logoFile = req.file;

    if (!logoFile) {
      throw new AppError("Brand logo is required.", 400);
    }

    const isBrandNameExist = await Brand.exists({ name });

    if (isBrandNameExist) {
      throw new AppError("A brand whit this name already exists.", 409);
    }
    console.log(JSON.stringify(logoFile, null, 2));

    const newBrand = new Brand({
      name,
      content,
      website,
      logo: {
        url: logoFile.path,
        publicId: logoFile.filename,
      },
    });

    await newBrand.save();

    return sendSuccessResponse(res, "Brand created successfully.", newBrand);
  } catch (err) {
    next(err);
  }
};

exports.getBrands = async (req, res, next) => {
  try {
    const totalBrands = await Brand.countDocuments();

    const features = new APIFeatures(Brand.find(), req.query).sort().paginate();
    const brands = await features.query.select("name logo.url").lean();

    return sendSuccessResponse(res, "", {
      brands,
      pagination: {
        total: totalBrands,
        page: features.page,
        limit: features.limit,
        totalPages: Math.ceil(totalBrands / features.limit),
      },
    });
  } catch (err) {
    next(err);
  }
};
