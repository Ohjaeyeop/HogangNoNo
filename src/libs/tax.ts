const calculateTax = (rates: number[], range: number[], price: number) => {
  let tax = 0;
  for (let i = 0; i < rates.length; i++) {
    if (price >= range[i] && price < range[i + 1]) {
      tax += (price - range[i]) * rates[i];
      break;
    }
    tax += (range[i + 1] - range[i]) * rates[i];
  }

  return Math.round(tax * 10000);
};

export const getDefaultTax = (price: number) => {
  const rates = [0.001, 0.002, 0.004, 0];
  const range = [0, 5, 10, price + 1];

  return calculateTax(rates, range, price);
};

export const getWealthTax = (price: number) => {
  const rates = [0, 0.005, 0.007, 0.01, 0.014, 0.02, 0];
  const range = [0, 11, 14, 23, 27, 61, price + 1];

  return calculateTax(rates, range, price);
};

export const getTax = (price: number) => {
  return getDefaultTax(price) + getWealthTax(price);
};
