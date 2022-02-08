const getTax = (rates: number[], range: number[], price: number) => {
  let tax = 0;
  rates.forEach((rate, i) => {
    if (price >= rate && price < rates[i + 1]) {
      return tax + (price - range[i]) * rates[i];
    }
    tax += (range[i + 1] - range[i]) * rates[i];
  });
};

export const getDefaultTax = (price: number) => {
  const rates = [0.001, 0.002, 0.004, 0];
  const range = [0, 5, 10, price + 1];

  return getTax(rates, range, price);
};

export const getWealthTax = (price: number) => {
  const rates = [0, 0.005, 0.007, 0.01, 0.014, 0.02, 0];
  const range = [0, 11, 14, 23, 27, 61, price + 1];

  return getTax(rates, range, price);
};
