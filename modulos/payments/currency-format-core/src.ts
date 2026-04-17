export function getCurrencyDecimals(currency = "USD") {
  const code = currency.toUpperCase();
  const zeroDecimalCurrencies = [
    "CLP",
    "PYG",
    "JPY",
    "KRW",
    "VND",
    "BIF",
    "DJF",
    "GNF",
    "KMF",
    "MGA",
    "RWF",
    "UGX",
    "VUV",
    "XAF",
    "XOF",
    "XPF",
  ];
  return zeroDecimalCurrencies.includes(code) ? 0 : 2;
}

export function formatPrice(amount: number, currency = "USD") {
  try {
    const code = currency.toUpperCase();
    const decimals = getCurrencyDecimals(code);
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}

export function getCurrencyStep(currency = "USD") {
  return getCurrencyDecimals(currency) === 0 ? "1" : "0.01";
}
