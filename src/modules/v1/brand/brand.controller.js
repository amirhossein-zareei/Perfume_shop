const { Brand } = require("../../../models/index");
const { deleteFiles } = require("../../../services/cloudinaryService");
const APIFeatures = require("../../../utils/apiFeatures");
const {
  sendSuccess,
  generatePaginationData,
} = require("../../../utils/apiResponse");
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

    return sendSuccess(res, "Brand created successfully.", newBrand, 201);
  } catch (err) {
    next(err);
  }
};

exports.getBrands = async (req, res, next) => {
  try {
    const totalBrands = await Brand.countDocuments();

    const features = new APIFeatures(Brand.find(), req.query).sort().paginate();
    const brands = await features.query.select("name slug logo.url").lean();

    pagination = generatePaginationData(totalBrands, features);

    return sendSuccess(res, "", {
      brands,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBrand = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const brand = await Brand.findOne({ slug }).lean();

    if (!brand) {
      throw new AppError("Brand not found.", 404);
    }

    return sendSuccess(res, "", brand);
  } catch (err) {
    next(err);
  }
};

exports.deleteBrand = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const brand = await Brand.findOneAndDelete({ slug })
      .select("name slug")
      .lean();

    if (!brand) {
      throw new AppError("Brand not found.", 404);
    }

    return sendSuccess(res, "Brand deleted successfully.", brand);
  } catch (err) {
    next(err);
  }
};

exports.updateBrand = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;
    const logoFile = req.file;

    const brand = await Brand.findOne({ slug });

    if (!brand) {
      throw new AppError("Brand not found.", 404);
    }

    if (name && name !== brand.name) {
      const existingBrandWithNewName = await Brand.findOne({
        name,
        _id: { $ne: brand._id },
      });

      if (existingBrandWithNewName) {
        throw new AppError("This brand name is already in use.", 409);
      }
    }

    if (logoFile) {
      await deleteFiles(brand.logo.publicId);

      brand.logo.url = logoFile.path;
      brand.logo.publicId = logoFile.filename;
    }

    Object.keys(req.body).forEach((key) => {
      brand[key] = req.body[key];
    });

    const updatedBrand = await brand.save();

    return sendSuccess(res, "Brand updated successfully.", updatedBrand);
  } catch (err) {
    next(err);
  }
};
