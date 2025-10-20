const { ObjectId } = require("mongodb");

const { Cart, CartItem, Product } = require("../../../models");
const { sendSuccess } = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");

const _updateCartItemQuantity = async (userId, itemId, quantityChange) => {
  const objectItemId = new ObjectId(itemId);

  const cart = await Cart.aggregate([
    { $match: { userId, items: objectItemId } },
    {
      $lookup: {
        from: "cartitems",
        localField: "items",
        foreignField: "_id",
        as: "items",
      },
    },
  ]);

  if (!cart.length) {
    throw new AppError("Item not found in cart.", 404);
  }

  const cartItem = cart[0].items[0];

  const product = await Product.findOne({
    _id: cartItem.productId,
    isActive: true,
    "volumes._id": cartItem.volumeId,
    "volumes.isActive": true,
  });

  if (!product) {
    throw new AppError("Product or volume not found or inactive.", 404);
  }

  const item = await CartItem.findById(itemId);
  const newQuantity = item.quantity + Number(quantityChange);

  if (newQuantity < 0 || newQuantity > 10) {
    return null;
  }

  if (newQuantity === 0) {
    await Promise.all([
      Cart.updateOne({ userId }, { $pull: { items: objectItemId } }),
      CartItem.deleteOne({ _id: objectItemId }),
    ]);

    item.quantity = newQuantity;
    return item;
  }

  item.quantity = newQuantity;
  item.save();

  return item;
};

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

exports.addItemToCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId, volumeId, quantity } = req.body;

    let product = await Product.findOne(
      {
        _id: productId,
        isActive: true,
      },
      { volumes: 1 }
    ).lean();

    if (!product) {
      throw new AppError("Product or volume not found or inactive.", 404);
    }

    const volume = product.volumes.find(
      (v) => v._id.equals(volumeId) && v.isActive
    );

    if (!volume) {
      throw new AppError("Volume not found or inactive.", 404);
    }

    if (volume.type === "bottle" && quantity > volume.stock) {
      throw new AppError(
        `Requested quantity exceeds available stock of ${volume.stock}.`,
        400
      );
    }

    let cart = await Cart.findOne({ userId }).populate("items");

    if (!cart) {
      const newItem = await CartItem.create({
        productId,
        volumeId,
        quantity,
      });

      cart = await Cart.create({
        userId,
        items: [newItem._id],
      }).populate("items");
    } else {
      const existingItem = cart.items.find(
        (item) =>
          item.productId?.equals(productId) && item.volumeId?.equals(volumeId)
      );

      if (!existingItem) {
        const newItem = await CartItem.create({
          productId,
          volumeId,
          quantity,
        });

        cart.items.push(newItem._id);
        await cart.save();
      } else {
        await CartItem.findOneAndUpdate(
          { _id: existingItem._id },
          { $inc: { quantity } }
        );
      }
    }

    return sendSuccess(res, "Item added to cart successfully.", {
      totalItemToCart: cart.items.length,
    });
  } catch (err) {
    next(err);
  }
};

exports.increaseCartItemQuantity = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    const { quantity } = req.body;

    const cartItem = await _updateCartItemQuantity(userId, itemId, quantity);
    if (!cartItem) {
      throw new AppError("Quantity update exceeds allowed limits.", 400);
    }

    return sendSuccess(res, "Cart item quantity increased successfully.", {
      itemId: cartItem._id,
      quantity: cartItem.quantity,
    });
  } catch (err) {
    next(err);
  }
};

exports.decreaseCartItemQuantity = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    const { quantity } = req.body;

    const cartItem = await _updateCartItemQuantity(userId, itemId, -quantity);

    if (!cartItem) {
      throw new AppError("Quantity update exceeds allowed limits.", 400);
    }

    return sendSuccess(res, "Cart item quantity decreased successfully.", {
      itemId: cartItem._id,
      quantity: cartItem.quantity,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const objectItemId = new ObjectId(itemId);

    const userId = req.user._id;

    const cart = await Cart.findOneAndUpdate(
      {
        userId,
        items: objectItemId,
      },
      {
        $pull: { items: objectItemId },
      }
    );

    if (!cart) {
      throw new AppError("Item not found in cart.", 404);
    }

    await CartItem.deleteOne({ _id: objectItemId });

    return sendSuccess(res, "Cart item removed successfully.", {
      itemId: itemId,
    });
  } catch (err) {
    next(err);
  }
};
