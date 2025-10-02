const { Product, Brand, Category } = require("../../../models");
const APIFeatures = require("../../../utils/apiFeatures");
const {
  sendSuccess,
  generatePaginationData,
} = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");

const _buildProductPipeline = (project) => {
  const pipeline = [];

  pipeline.push({
    $addFields: {
      priceAfterDiscount: {
        $round: [
          {
            $multiply: [
              "$price",
              { $subtract: [1, { $divide: ["$discount", 100] }] },
            ],
          },
          0,
        ],
      },
    },
  });

  pipeline.push({ $project: project });

  return pipeline;
};

const _getProducts = async (req, res, project, filter = {}) => {
  let features = new APIFeatures(Product, req.query)
    .calculateStartingPrice()
    .sort()
    .paginate();

  features.pipeline.unshift({ $match: filter });
  features.pipeline.push(..._buildProductPipeline(project));

  const [totalProducts, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.aggregate(features.pipeline),
  ]);

  const pagination = generatePaginationData(totalProducts, features);

  return sendSuccess(res, "", {
    products,
    pagination,
  });
};

exports.createProduct = async (req, res, next) => {
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
    const project = {
      name: 1,
      slug: 1,
      coverImage: "$coverImage.url",
      price: 1,
      priceAfterDiscount: 1,
    };

    await _getProducts(req, res, project, { isActive: true });
  } catch (err) {
    next(err);
  }
};

exports.getPublicProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    let product = await Product.findOne({
      slug,
      isActive: true,
    }).select(" -isActive -__v");

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    product = product.toJSON();
    delete product.id;

    return sendSuccess(res, "", product);
  } catch (err) {
    next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const project = {
      name: 1,
      slug: 1,
      coverImage: "$coverImage.url",
      price: 1,
      priceAfterDiscount: 1,
      isActive: 1,
    };

    await _getProducts(req, res, project);
  } catch (err) {
    next(err);
  }
};

exports.getAdminProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    let product = await Product.findOne({ slug });

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    product = product.toJSON();
    delete product.id;

    return sendSuccess(res, "", product);
  } catch (err) {
    next(err);
  }
};
