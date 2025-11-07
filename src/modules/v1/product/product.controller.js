const { Product, Brand, Category, Comment } = require("../../../models");
const APIFeatures = require("../../../utils/apiFeatures");
const {
  sendSuccess,
  generatePaginationData,
} = require("../../../utils/apiResponse");
const { deleteFiles } = require("../../../services/cloudinaryService");
const AppError = require("../../../utils/AppError");
const { currency } = require("../../../config/env");
const {
  getCommentsWithPagination,
} = require("../../../services/commentService");

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
    currency,
  });
};

const _updateProductActiveStatus = async (slug, isActive) => {
  const product = await Product.findOneAndUpdate({ slug }, { isActive })
    .select("name slug isActive")
    .lean();

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  if (product.isActive === isActive) {
    throw new AppError(
      `Product is already ${isActive ? "active" : "inactive"}.`,
      400
    );
  }

  return product;
};

exports.createProduct = async (req, res, next) => {
  try {
    const image = req.file;
    if (!image) {
      throw new AppError("Cover image is required.", 400);
    }

    const fieldsToNewProduct = {};
    [
      "name",
      "description",
      "brandId",
      "volumes",
      "categoryIds",
      "discount",
    ].forEach((key) => {
      fieldsToNewProduct[key] = req.body[key];
    });

    fieldsToNewProduct.coverImage = {
      url: image.path,
      publicId: image.filename,
    };

    const [isProductNameExists, isBrandNameExists, foundCategoryIds] =
      await Promise.all([
        Product.exists({ name: fieldsToNewProduct.name }),

        Brand.exists({ _id: fieldsToNewProduct.brandId }),

        Category.find({
          _id: { $in: fieldsToNewProduct.categoryIds },
        }).select("_id"),
      ]);

    if (!isBrandNameExists) {
      throw new AppError("Brand not found.", 404);
    }

    if (foundCategoryIds.length !== fieldsToNewProduct.categoryIds.length) {
      throw new AppError("One or more categories were not found.", 404);
    }

    if (isProductNameExists) {
      throw new AppError("A product with this name already exists.", 409);
    }

    const newProduct = new Product(fieldsToNewProduct);
    await newProduct.save();

    return sendSuccess(
      res,
      "Product created successfully",
      { product: newProduct },
      201
    );
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

    return sendSuccess(res, "", { product, currency });
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

    return sendSuccess(res, "", { product, currency });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const fieldsToUpdate = {};
    [
      "name",
      "description",
      "brandId",
      "volumes",
      "categoryIds",
      "discount",
    ].forEach((key) => {
      if (req.body[key] !== undefined) fieldsToUpdate[key] = req.body[key];
    });

    let [product, isProductNameExists, isBrandNameExists, foundCategoryIds] =
      await Promise.all([
        Product.findOne({ slug }),

        fieldsToUpdate.name
          ? Product.exists({ name: fieldsToUpdate.name })
          : Promise.resolve(false),

        fieldsToUpdate.brandId
          ? Brand.exists({ _id: fieldsToUpdate.brandId })
          : Promise.resolve(false),

        fieldsToUpdate.categoryIds?.length
          ? Category.find({
              _id: { $in: fieldsToUpdate.categoryIds },
            }).select("_id")
          : Promise.resolve([]),
      ]);

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    if (isProductNameExists) {
      throw new AppError("A product with this name already exists.", 409);
    }

    if (fieldsToUpdate.brandId && !isBrandNameExists) {
      throw new AppError("Brand not found.", 404);
    }

    if (
      fieldsToUpdate.categoryIds?.length &&
      foundCategoryIds.length !== fieldsToUpdate.categoryIds.length
    ) {
      throw new AppError("One or more categories were not found.", 404);
    }

    if (req.file) {
      await deleteFiles(product.coverImage.publicId);

      fieldsToUpdate.coverImage = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    product.set(fieldsToUpdate);
    await product.save();

    return sendSuccess(res, "", { product });
  } catch (err) {
    next(err);
  }
};

exports.activateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await _updateProductActiveStatus(slug, true);
    product.isActive = true;

    return sendSuccess(res, "Product activated successfully.", { product });
  } catch (err) {
    next(err);
  }
};

exports.deactivateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    let product = await _updateProductActiveStatus(slug, false);
    product.isActive = false;

    return sendSuccess(res, "Product deactivated successfully.", { product });
  } catch (err) {
    next(err);
  }
};

exports.addGalleryImages = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const newImages = req.files;

    const product = await Product.findOne({ slug });

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    if (!newImages || newImages.length === 0) {
      throw new AppError("No images gallery", 400);
    }

    const oldGallery = product.galleryImages;

    if (oldGallery && oldGallery.length > 0) {
      const oldIds = oldGallery.map((img) => img.publicId);

      await deleteFiles(oldIds);
    }

    const newGallery = newImages.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    product.galleryImages = newGallery;
    await product.save();

    return sendSuccess(res, "Gallery updated successfully.", {
      galleryImages: product.galleryImages,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteGalleryImages = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    if (product.galleryImages.length === 0) {
      throw new AppError("Gallery is already empty.", 400);
    }

    const oldIds = product.galleryImages.map((img) => img.publicId);
    await deleteFiles(oldIds);

    product.galleryImages = [];
    await product.save();

    return sendSuccess(res, "Gallery deleted successfully.");
  } catch (err) {
    next(err);
  }
};

exports.getProductComments = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, isActive: true }).select(
      "_id"
    );

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    const { comments, pagination } = await getCommentsWithPagination(
      { productId: product._id, status: "approved" },
      req.query,
      { includeProduct: false }
    );

    return sendSuccess(res, "", {
      comments,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

exports.createProductComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { slug } = req.params;
    const { content, rating } = req.body;

    const product = await Product.findOne({ slug, isActive: true }).select(
      "_id"
    );

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    const isCommented = await Comment.exists({
      userId,
      productId: product._id,
    });

    if (isCommented) {
      throw new AppError("You have already commented on this product.", 400);
    }

    await Comment.create({
      content,
      rating,
      userId,
      productId: product._id,
    });

    return sendSuccess(res, "Comment submitted successfully", {}, 201);
  } catch (err) {
    next(err);
  }
};
