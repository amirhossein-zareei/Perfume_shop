const { Product, Brand, Category } = require("../../../models");
const {
  sendSuccess,
} = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");

exports.crateProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      brand: brandId,
      volumes,
      categories: categoryIds,
    } = req.body;
    const image = req.file;

    if (!image) {
      throw new AppError("Cover image is required.", 400);
    }

    const isBrandNameExists = await Brand.exists({ _id: brandId });
    if (!isBrandNameExists) {
      throw new AppError("Brand not found.", 404);
    }

    const foundCategories = await Category.find({
      _id: { $in: categoryIds },
    }).select("_id");
    if (foundCategories.length !== categoryIds.length) {
      throw new AppError("One or more categories were not found.", 404);
    }

    const isProductNameExists = await Product.exists({ name });
    if (isProductNameExists) {
      throw new AppError("A product with this name already exists.", 409);
    }

    const newProduct = new Product({
      name,
      description,
      brand: brandId,
      categories: categoryIds,
      volumes,
      coverImage: {
        url: image.path,
        publicId: image.filename,
      },
    });
    await newProduct.save();

    return sendSuccess(res, "Product created successfully", newProduct, 201);
  } catch (err) {
    next(err);
  }
};
