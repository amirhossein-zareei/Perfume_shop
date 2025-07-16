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
