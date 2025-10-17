const { Cart, CartItem } = require("../../../models");
const {
  sendSuccess,
  generatePaginationData,
} = require("../../../utils/apiResponse");

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: {
        path: "product",
        model: "Product",
        select: "name slug coverImage.url volumes discount isActive",
      },
    });

    const items = cart ? cart.items : [];

    if (items.length === 0) {
      return sendSuccess(res, "Cart is empty.", {
        cart: {
          _id: cart._id,
          items: [],
          totalPrice: 0,
          finalPrice: 0,
        },
      });
    }

    let totalPrice = 0;
    let finalPrice = 0;
    const bulkOps = [];

    const updatedItems = items.map((item) => {
      const product = item.product;
      const volume = product?.volumes.find((v) => v._id.equals(item.volumeId));

      const isAvailable =
        product && product.isActive && volume && volume.isActive ? true : false;

      if (!isAvailable) {
        bulkOps.push({
          updateOne: {
            filter: { _id: item._id },
            update: { $set: { isAvailable: false } },
          },
        });
      }

      const discountedPrice = volume.priceAfterDiscount || volume.price;

      const itemFinalPrice = discountedPrice * item.quantity;

      if (isAvailable) {
        totalPrice += volume.price * item.quantity;
        finalPrice += itemFinalPrice;
      }

      return {
        _id: item._id,
        product: {
          _id: item.product._id,
          name: item.product.name,
          slug: item.product.slug,
          coverImage: item.product.coverImage.url,
          discount: item.product.discount,
        },
        volume: {
          _id: volume._id,
          type: volume.type,
          size: volume.size,
          price: volume.price,
        },
        quantity: item.quantity,
        isAvailable,
        itemFinalPrice,
        itemTotalPrice: volume.price * item.quantity,
      };
    });

    if (bulkOps.length) await CartItem.bulkWrite(bulkOps);

    return sendSuccess(res, "Cart retrieved successfully", {
      cart: { _id: cart._id, items: updatedItems, totalPrice, finalPrice },
    });
  } catch (err) {
    next(err);
  }
};
