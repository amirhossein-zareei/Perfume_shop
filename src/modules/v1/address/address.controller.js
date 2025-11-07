const { Address, City, State } = require("../../../models");
const { sendSuccess } = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");

const _checkAddressAccess = async (user, addressId) => {
  const address = await Address.findById(addressId);

  if (!address) {
    throw new AppError("Address not found.", 404);
  }

  if (
    address.userId.toString() !== user._id.toString() &&
    user.role !== "ADMIN"
  ) {
    throw new AppError(
      "You do not have permission to perform this action.",
      403
    );
  }

  return address;
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

    return sendSuccess(
      res,
      "Address created successfully.",
      { address: newAddress },
      201
    );
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

    return sendSuccess(res, "", { addresses });
  } catch (err) {
    next(err);
  }
};

exports.getAddress = async (req, res, next) => {
  try {
    const address = await _checkAddressAccess(req.user, req.params.addressId);

    return sendSuccess(res, "", { address });
  } catch (err) {
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { stateId, cityId } = req.body;

    const address = await _checkAddressAccess(req.user, addressId);

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

    return sendSuccess(res, "Address updated successfully.", {
      address: updatedAddress,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const address = await _checkAddressAccess(req.user, addressId);

    await address.deleteOne();

    return sendSuccess(res, "Address deleted successfully.");
  } catch (err) {
    next(err);
  }
};
