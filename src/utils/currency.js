const ZERO_DECIMAL_CURRENCIES = [
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
];

exports.convertToSmallestUnit = (amount, currency) => {
  const upperCurrency = currency.toUpperCase();

  if (ZERO_DECIMAL_CURRENCIES.includes(upperCurrency)) {
    return Math.round(amount);
  }

  return Math.round(amount * 100);
};
