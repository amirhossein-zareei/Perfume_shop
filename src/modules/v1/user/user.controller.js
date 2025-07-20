const { User, Address, City, State, Order } = require("../../../models");
const { performLogout } = require("../../../services/tokenService");
const {
  sendSuccess,
  generatePaginationData,
} = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");
const {
  deleteFiles,
  generateSignedUrl,
} = require("../../../services/cloudinaryService");
const APIFeatures = require("../../../utils/apiFeatures");

exports.getMe = (req, res, next) => {
  const user = req.user;

  const avatarUrl = generateSignedUrl(user.avatarPublicId);

  user.avatarUrl = avatarUrl;
  delete user.avatarPublicId;

  return sendSuccess(res, "User profile retrieved successfully.", user);
};

exports.deleteMe = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(
      userId,
      { isActive: false, $inc: { tokenVersion: 1 } },
      { new: true }
    );

    await performLogout(req, res);

    return sendSuccess(
      res,
      "Your account has been successfully deactivated and you have been logged out."
    );
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    );
    return sendSuccess(res, "Your information has been updated successfully", {
      name: updatedUser.name,
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadProfileImage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const image = req.file;

    if (!image) {
      throw new AppError("No image provided", 400);
    }

    const user = await User.findById(userId);

    const oldPublicId = user.avatarPublicId;

    if (oldPublicId !== "profiles_images/cu2y7fkd8irfo16pixpx") {
      await deleteFiles(oldPublicId, "authenticated");
    }

    const newPublicId = image.filename;
    user.avatarPublicId = newPublicId;

    await user.save();

    const imageUrl = generateSignedUrl(newPublicId);

    const userObject = user.toObject();
    delete userObject.avatarPublicId;
    userObject.avatarUrl = imageUrl;

    return sendSuccess(res, "", userObject);
  } catch (err) {
    next(err);
  }
};

exports.getAddresses = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const addresses = await Address.find({ userId })
      .populate("stateId", "name")
      .populate("cityId", "name")
      .lean();

    return sendSuccess(res, "", addresses);
  } catch (err) {
    next(err);
  }
};

exports.getUserAddresses = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userExists = await User.findOne({ _id: userId });

    if (!userExists) {
      throw new AppError("User not found.", 404);
    }

    const userAddresses = await Address.find({ userId })
      .select("-userId")
      .lean();

    return sendSuccess(res, "", {
      username: userExists.name,
      addresses: userAddresses,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalOrders = await Order.countDocuments({ userId });

    const features = new APIFeatures(Order.find({ userId }), req.query)
      .sort()
      .paginate();
    const orders = await features.query;

    pagination = generatePaginationData(totalOrders, features);

    return sendSuccess(res, "", {
      orders,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();

    const features = new APIFeatures(User.find(), req.query).sort().paginate();
    const users = await features.query
      .select("name email avatarPublicId")
      .lean();

    users.forEach((user) => {
      const avatarUrl = generateSignedUrl(user.avatarPublicId);

      user.avatarUrl = avatarUrl;
      delete user.avatarPublicId;
    });

    pagination = generatePaginationData(totalUsers, features);

    return sendSuccess(res, "", {
      users,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;

    const targetUser = await User.findById(targetUserId).lean();

    if (!targetUser) {
      throw new AppError("User not found.", 404);
    }

    const avatarUrl = generateSignedUrl(targetUser.avatarPublicId);

    targetUser.avatarUrl = avatarUrl;
    delete targetUser.avatarPublicId;

    return sendSuccess(res, "", targetUser);
  } catch (err) {
    next(err);
  }
};

exports.changeRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role, $inc: { tokenVersion: 1 } },
      { new: true }
    )
      .select("name email role")
      .lean();

    if (!updatedUser) {
      throw new AppError("User not found.", 404);
    }

    return sendSuccess(
      res,
      "User role has been updated successfully.",
      updatedUser
    );
  } catch (err) {
    next(err);
  }
};

exports.banUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const bannedUser = await User.findByIdAndUpdate(
      userId,
      { isBanned: true, $inc: { tokenVersion: 1 } },
      { new: true }
    )
      .select("name email role isBanned")
      .lean();

    if (!bannedUser) {
      throw new AppError("User not found.", 404);
    }

    return sendSuccess(res, "User has been banned successfully.", bannedUser);
  } catch (err) {
    next(err);
  }
};

exports.unbanUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const unbannedUser = await User.findByIdAndUpdate(
      userId,
      { isBanned: false },
      { new: true }
    )
      .select("name email role isBanned")
      .lean();

    if (!unbannedUser) {
      throw new AppError("User not found.", 404);
    }

    return sendSuccess(
      res,
      "User has been unbanned successfully.",
      unbannedUser
    );
  } catch (err) {
    next(err);
  }
};

exports.reactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const reactivatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    )
      .select("name email role isActive")
      .lean();

    if (!reactivatedUser) {
      throw new AppError("User not found.", 404);
    }

    return sendSuccess(
      res,
      "User has been reactivated successfully.",
      reactivatedUser
    );
  } catch (err) {
    next(err);
  }
};
