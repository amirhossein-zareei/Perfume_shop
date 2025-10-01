const { Product, Brand, Category } = require("../../../models");
const APIFeatures = require("../../../utils/apiFeatures");
const {
  sendSuccess,
  generatePaginationData,
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
      discount,
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
      discount,
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

exports.getPublicProducts = async (req, res, next) => {
  try {
    let features = new APIFeatures(Product, req.query)
      .calculateStartingPrice()
      .sort()
      .paginate();

    features.pipeline.unshift({
      $match: { isActive: true },
    });

    features.pipeline.push({
      $project: {
        name: 1,
        slug: 1,
        price: 1,
      },
    });

    const [totalProducts, products] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Product.aggregate(features.pipeline),
    ]);

    const pagination = generatePaginationData(totalProducts, features);

    return sendSuccess(res, "", {
      products,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};
