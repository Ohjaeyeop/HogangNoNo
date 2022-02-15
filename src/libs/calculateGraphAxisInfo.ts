const calculateMaxValue = (amount: number, gap: number) => {
  let i = 0;
  while (true) {
    i++;
    if (amount <= gap * i) {
      if (amount <= gap * (i - 1) + gap / 2) {
        return amount;
      } else {
        return gap * i;
      }
    }
  }
};

export const calculateGraphAxisInfo = (amount: number) => {
  let maxValue = 0;
  let gap = 0;
  let line = 0;
  const gaps = [1, 2, 5, 10];
  const ranges = [0, 6, 12, 25, 50];

  let unit = 1;
  while (true) {
    for (let i = 0; i < 4; i++) {
      if (amount >= ranges[i] * unit && amount <= ranges[i + 1] * unit) {
        gap = gaps[i] * unit;
        maxValue = calculateMaxValue(amount, gap);
        line = Math.floor(maxValue / gap) + 1;
        break;
      }
    }
    if (maxValue) {
      break;
    }
    unit *= 10;
  }

  return {maxValue, gap, line};
};
