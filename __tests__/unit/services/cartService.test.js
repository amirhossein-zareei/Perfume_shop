const {
  calculatePrice,
  calculateCartTotals,
  getCheckoutReadyItems,
  createItemSnapshot,
} = require("../../../src/services/cartService");

describe("calculatePrice", () => {
  test.each([
    [100, 50, 50],
    [100, 0, 100],
    [100, undefined, 100],
    [100, null, 100],
    [99, 10, 89],
  ])("basePrice=%d discount=%i", (basePrice, discount, expected) => {
    expect(calculatePrice(basePrice, discount)).toBe(expected);
  });
});

describe("calculateCartTotals", () => {
  test.each([
    {
      title: "No items -> zeros",
      items: [],
      expected: { totalPrice: 0, finalPrice: 0 },
    },
    {
      title: "One available item, no discount",
      items: [
        {
          isAvailable: true,
          quantity: 2,
          volume: { price: 100 },
          product: { discount: 0 },
        },
      ],
      expected: { totalPrice: 200, finalPrice: 200 },
    },
    {
      title: "One available item, with discount",
      items: [
        {
          isAvailable: true,
          quantity: 3,
          volume: { price: 100 },
          product: { discount: 50 },
        },
      ],
      expected: { totalPrice: 300, finalPrice: 150 },
    },
    {
      title: "Skip unavailable or missing volume",
      items: [
        {
          isAvailable: false,
          quantity: 2,
          volume: { price: 100 },
          product: { discount: 50 },
        },
        {
          isAvailable: true,
          quantity: 1,
          volume: null,
          product: { discount: 50 },
        },
        {
          isAvailable: true,
          quantity: 2,
          volume: { price: 80 },
          product: { discount: 0 },
        },
      ],
      expected: { totalPrice: 160, finalPrice: 160 },
    },
    {
      title: "Multiple items mixed discounts",
      items: [
        {
          isAvailable: true,
          quantity: 2,
          volume: { price: 100 },
          product: { discount: 10 },
        },
        {
          isAvailable: true,
          quantity: 1,
          volume: { price: 50 },
          product: { discount: 0 },
        },
      ],
      expected: { totalPrice: 250, finalPrice: 230 },
    },
  ])("$title", ({ items, expected }) => {
    expect(calculateCartTotals(items)).toEqual(expected);
  });
});

describe("getCheckoutReadyItems", () => {
  test.each([
    {
      title: "Exclude if item is not available",
      items: [
        {
          isAvailable: false,
          quantity: 1,
          volume: { type: "bottle", stock: 10 },
        },
      ],
      expected: [],
    },
    {
      title: "Exclude if volume is null or missing",
      items: [
        {
          isAvailable: true,
          quantity: 1,
          volume: null,
        },
      ],
      expected: [],
    },
    {
      title: "Exclude if both unavailable and volume missing",
      items: [
        {
          isAvailable: false,
          quantity: 1,
          volume: null,
        },
      ],
      expected: [],
    },
    {
      title: "Keep item if type is NOT bottle",
      items: [
        {
          isAvailable: true,
          quantity: 5,
          volume: { type: "sample", stock: 0 },
        },
      ],
      expected: [
        {
          isAvailable: true,
          quantity: 5,
          volume: { type: "sample", stock: 0 },
        },
      ],
    },
    {
      title: "Exclude bottle if stock is less than quantity",
      items: [
        {
          isAvailable: true,
          quantity: 5,
          volume: { type: "bottle", stock: 2 },
        },
      ],
      expected: [],
    },
    {
      title: "Keep bottle if stock is greater than or equal to quantity",
      items: [
        {
          isAvailable: true,
          quantity: 5,
          volume: { type: "bottle", stock: 5 },
        },
        {
          isAvailable: true,
          quantity: 2,
          volume: { type: "bottle", stock: 10 },
        },
      ],
      expected: [
        {
          isAvailable: true,
          quantity: 5,
          volume: { type: "bottle", stock: 5 },
        },
        {
          isAvailable: true,
          quantity: 2,
          volume: { type: "bottle", stock: 10 },
        },
      ],
    },
  ])("$title", ({ items, expected }) => {
    expect(getCheckoutReadyItems(items)).toEqual(expected);
  });
});

describe("createItemSnapshot", () => {
  test("should correctly map product details and extract image URL", () => {
    const mockItem = {
      product: {
        _id: "prod_123",
        name: "Savage Dior",
        slug: "savage-dior",
        discount: 20,
        coverImage: { url: "https://example.com/img.jpg", publicId: "123" },
      },
      volume: {
        _id: "vol_123",
        price: 1000,
        type: "bottle",
        size: "100ml",
      },
      quantity: 2,
    };

    const result = createItemSnapshot(mockItem);

    expect(result).toEqual({
      product: {
        _id: "prod_123",
        name: "Savage Dior",
        slug: "savage-dior",
        coverImage: "https://example.com/img.jpg",
      },
      volume: {
        _id: "vol_123",
        type: "bottle",
        size: "100ml",
      },
      quantity: 2,
      unitPrice: 800,
    });
  });
});
