const { Category } = require("../../../models");
const sendSuccess = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");

exports.createCategory = async (req, res, next) => {
  try {
    const { name, parentId } = req.body;
    const iconFile = req.file;

    const isCategoryNameExists = await Category.exists({ name });

    if (isCategoryNameExists) {
      throw new AppError("A category with this name already exists.", 409);
    }

    if (parentId) {
      const isParentIdExists = await Category.exists({ _id: parentId });

      if (!isParentIdExists) {
        throw new AppError("The specified parent dose not exists.", 400);
      }
    }

    const newCategory = new Category({
      name,
      parentId: parentId || null,
      icon: iconFile
        ? { url: iconFile.path, publicId: iconFile.filename }
        : undefined,
    });

    await newCategory.save();

    return sendSuccess(res, "Category created successfully.", newCategory, 201);
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const allCategories = await Category.find({ isActive: true })
      .select("name slug icon.url")
      .lean();

    const categoryMap = new Map();
    allCategories.forEach((category) => {
      category.children = [];

      categoryMap.set(category._id.toString(), category);
    });

    const nestedCategories = [];
    allCategories.forEach((category) => {
      const parentId = category.parentId;

      if (parentId) {
        const parent = categoryMap.get(parentId.toString());

        if (parent) {
          parent.children.push(category);
        }
      } else {
        nestedCategories.push(category);
      }
    });

    return sendSuccess(
      res,
      "Categories retrieved successfully.",
      nestedCategories
    );
  } catch (err) {
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true }).lean();

    if (!category) {
      throw new AppError("Category not found.", 404);
    }

    return sendSuccess(res, "", category);
  } catch (err) {
    next(err);
  }
};
