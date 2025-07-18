const { Category } = require("../../../models");
const sendSuccess = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");

const _validateParentCategory = async (parentId) => {
  if (parentId) {
    const isParentIdExists = await Category.exists({ _id: parentId });

    if (!isParentIdExists) {
      throw new AppError("The specified parent dose not exists.", 400);
    }
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, parentId } = req.body;
    const iconFile = req.file;

    const isCategoryNameExists = await Category.exists({ name });

    if (isCategoryNameExists) {
      throw new AppError("A category with this name already exists.", 409);
    }

    await _validateParentCategory(parentId);

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
      .select("name slug parentId icon.url")
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

exports.deleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });

    if (!category) {
      throw new AppError("Category not found.", 404);
    }

    if (!category.isActive) {
      throw new AppError("This category is already deactivated.", 400);
    }

    category.isActive = false;
    await category.save();

    return sendSuccess(res, "Category deactivated successfully.", {
      name: category.name,
    });
  } catch (err) {
    next(err);
  }
};

exports.updatedCategory = async (req, res, next) => {
  try {
    const { name, parentId } = req.body;
    const { slug } = req.params;
    const iconFile = req.file;

    const category = await Category.findOne({ slug });

    if (!category) {
      throw new AppError("Category not found.", 404);
    }

    if (name && name !== category.name) {
      const existingCategoryWithNewName = await Category.findOne({
        name,
        _id: { $ne: category._id },
      });

      if (existingCategoryWithNewName) {
        throw new AppError("This category name is already in use.", 409);
      }
    }

    await _validateParentCategory(parentId);

    Object.keys(req.body).forEach((key) => {
      category[key] = req.body[key];
    });

    if (iconFile) {
      const publicId = category.icon.publicId;

      if (publicId) {
        await deleteFiles(publicId);
      }

      category.icon.url = iconFile.path;
      category.icon.publicId = iconFile.filename;
    }

    const updatedCategory = await category.save();

    return sendSuccess(
      res,
      "Category updated successfully.",
      updatedCategory
    );
  } catch (err) {
    next(err);
  }
};
