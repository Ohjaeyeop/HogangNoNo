export const displayedAmount = (amount: number) => {
  const amount1 = Math.floor(amount / 10000);
  const amount2 = amount % 10000;
  const displayedAmount1 = amount1 > 0 ? `${amount1}억` : '';
  const displayedAmount2 =
    amount2 >= 1000
      ? amount2.toString().slice(0, 1) + ',' + amount2.toString().slice(1)
      : amount2 > 0
      ? amount2.toString()
      : '';
  return displayedAmount1 + ' ' + displayedAmount2;
};
