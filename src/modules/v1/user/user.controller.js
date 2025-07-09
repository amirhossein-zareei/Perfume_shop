const { User, Address, City, State, Order } = require("../../../models");
const { performLogout } = require("../../../services/tokenService");
const sendSuccess = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");
const {
  deleteFiles,
  generateSignedUrl,
} = require("../../../services/cloudinaryService");

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

    await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });

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

exports.createAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      phone,
      stateId,
      cityId,
      addressLine,
      postalCode,
      latitude,
      longitude,
    } = req.body;

    const isCityValid = await City.exists({ _id: cityId });

    if (!isCityValid) {
      throw new AppError("City not found.", 400);
    }

    const isStateValid = await State.exists({ _id: stateId });

    if (!isStateValid) {
      throw new AppError("State not found.", 400);
    }

    const newAddress = await Address.create({
      phone,
      userId,
      stateId,
      cityId,
      addressLine,
      postalCode,
      latitude,
      longitude,
    });

    return sendSuccess(res, "Address created successfully.", newAddress, 201);
  } catch (err) {
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { stateId, cityId } = req.body;

    const address = await Address.findById(addressId);

    if (!address) {
      throw new AppError("Address not found", 404);
    }

    if (stateId) {
      const isStateValid = await State.exists({ _id: stateId });

      if (!isStateValid) {
        throw new AppError("State not found.", 400);
      }
    }

    if (cityId) {
      const isCityValid = await City.exists({ _id: cityId });

      if (!isCityValid) {
        throw new AppError("City not found.", 400);
      }
    }

    Object.assign(address, req.body);
    const updatedAddress = await address.save();

    return sendSuccess(res, "Address updated successfully.", updatedAddress);
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findByIdAndDelete(addressId);

    if (!address) {
      throw new AppError("Address not found", 404);
    }

    return sendSuccess(res, "Address deleted successfully.");
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId }).lean();

    return sendSuccess(res, "", orders);
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("name email avatarPublicId").lean();

    users.forEach((user) => {
      const avatarUrl = generateSignedUrl(user.avatarPublicId);

      user.avatarUrl = avatarUrl;
      delete user.avatarPublicId;
    });

    return sendSuccess(res, "", users);
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
