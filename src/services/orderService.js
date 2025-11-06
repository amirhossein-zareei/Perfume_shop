const { Product } = require("../models");

const adjustProductStock = async (items, operation) => {
  const bulkOps = items
    .filter((item) => item.volume.type === "bottle")
    .map((item) => ({
      updateOne: {
        filter: {
          _id: item.product._id,
          "volumes._id": item.volume._id,
          "volumes.stock": { $gte: item.quantity },
        },
        update: {
          $inc: { "volumes.$.stock": operation * item.quantity },
        },
      },
    }));

  const result = await Product.bulkWrite(bulkOps);

  return { result, bulkOps };
};

module.exports = { adjustProductStock };
