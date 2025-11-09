const { Cart, CartItem } = require("../models");
const AppError = require("../utils/AppError");

const getValidatedCartItems = async (userId) => {
  const cart = await Cart.findOne({ userId })
    .populate({
      path: "items",
      populate: {
        path: "productId",
        select: "name slug coverImage volumes discount isActive",
      },
    })
    .lean();

  if (!cart?.items?.length) {
    return { cart, items: [] };
  }

  const validatedItems = cart.items.map((item) => {
    const product = item.productId;

    const volume = product?.volumes?.find(
      (v) => v._id.toString() === item.volumeId.toString()
    );

    const isAvailable = Boolean(product?.isActive && volume.isActive);

    return {
      _id: item._id,
      product,
      volume,
      quantity: item.quantity,
      isAvailable,
    };
  });

  return { _id: cart._id, items: validatedItems };
};

const calculatePrice = (basePrice, discount = 0) => {
  if (!discount || discount === 0) {
    return basePrice;
  }

  const discountedPrice = Math.round(basePrice * (1 - discount / 100));

  return discountedPrice;
};

const calculateCartTotals = (items) => {
  let totalPrice = 0,
    finalPrice = 0;

  items.forEach((item) => {
    if (!item.isAvailable || !item.volume) {
      return;
    }

    const basePrice = item.volume.price * item.quantity;
    const discountedPrice =
      calculatePrice(item.volume.price, item.product?.discount) * item.quantity;

    totalPrice += basePrice;
    finalPrice += discountedPrice;
  });

  return { totalPrice, finalPrice };
};

const createItemSnapshot = (item) => {
  if (!item.product || !item.volume) {
    throw new AppError("Product or volume information is missing");
  }

  const unitPrice = calculatePrice(item.volume.price, item.product.discount);

  return {
    product: {
      _id: item.product._id,
      name: item.product.name,
      slug: item.product.slug,
      coverImage: item.product.coverImage?.url || item.product.coverImage,
    },
    volume: {
      _id: item.volume._id,
      type: item.volume.type,
      size: item.volume.size,
    },
    quantity: item.quantity,
    unitPrice,
  };
};

const getCheckoutReadyItems = (items) => {
  return items.filter((item) => {
    if (!item.isAvailable || !item.volume) {
      return false;
    }

    if (item.volume.type === "bottle") {
      return item.volume.stock >= item.quantity;
    }

    return true;
  });
};

const updateItemAvailability = async (items) => {
  const bulkOps = items
    .filter((item) => !item.isAvailable)
    .map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { isAvailable: false } },
      },
    }));

  if (bulkOps.length > 0) {
    await CartItem.bulkWrite(bulkOps);
  }
};

module.exports = {
  getValidatedCartItems,
  calculatePrice,
  calculateCartTotals,
  createItemSnapshot,
  getCheckoutReadyItems,
  updateItemAvailability,
};
