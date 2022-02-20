export const displayedAmount = (amount: number) => {
  let hundredMillion = Math.floor(amount / 10000).toString();
  let tenMillion = (Math.round((amount % 10000) / 100) * 100).toString();
  let tenThousand = Math.floor(amount % 10000).toString();

  hundredMillion = parseInt(hundredMillion) > 0 ? `${hundredMillion}억` : '';
  tenMillion =
    parseInt(tenMillion) >= 1000
      ? tenMillion.toString().slice(0, 1) + ',' + tenMillion.toString().slice(1)
      : parseInt(tenMillion) > 0
      ? tenMillion.toString()
      : '';
  tenThousand =
    parseInt(tenThousand) >= 1000
      ? tenThousand.toString().slice(0, 1) +
        ',' +
        tenThousand.toString().slice(1)
      : parseInt(tenThousand) > 0
      ? tenThousand.toString()
      : '';
  return {hundredMillion, tenMillion, tenThousand};
};
