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

Perfume_shop/
├── __tests__/                    👈 پوشه اصلی تست‌ها
│   ├── unit/                     👈 تست‌های واحد
│   │   ├── services/
│   │   │   ├── cartService.test.js
│   │   │   ├── orderService.test.js
│   │   │   └── tokenService.test.js
│   │   └── utils/
│   │       ├── apiFeatures.test.js
│   │       ├── currency.test.js
│   │       └── validationHelpers.test.js
│   │
│   ├── integration/              👈 تست‌های API
│   │   ├── auth. test.js
│   │   ├── product.test.js
│   │   └── order.test.js
│   │
│   └── mocks/                    👈 Mock ها
│       ├── captchaMock.js
│       └── paymentMock.js
│
├── src/
│   ├── modules/v1/
│   ├── services/
│   └── utils/
└── package.json