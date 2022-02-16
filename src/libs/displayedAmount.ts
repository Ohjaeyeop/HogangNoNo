class DisplayedAmount {
  averageDealAmount(amount: number) {
    const hundredMillion = Math.floor(amount / 10000);
    const tenMillion = Math.round((amount % 10000) / 100) * 100;
    const displayedAmount1 = hundredMillion > 0 ? `${hundredMillion}억` : '';
    const displayedAmount2 =
      tenMillion >= 1000
        ? tenMillion.toString().slice(0, 1) +
          ',' +
          tenMillion.toString().slice(1)
        : tenMillion > 0
        ? tenMillion.toString()
        : '';
    return (displayedAmount1 + ' ' + displayedAmount2).trim();
  }

  taxAmount(amount: number) {
    const hundredMillion = Math.floor(amount / 10000);
    const tenMillion = amount % 10000;
    const displayedAmount1 = hundredMillion > 0 ? `${hundredMillion}억` : '';
    const displayedAmount2 =
      tenMillion >= 1000
        ? tenMillion.toString().slice(0, 1) +
          ',' +
          tenMillion.toString().slice(1) +
          '만'
        : tenMillion > 0
        ? tenMillion.toString() + '만'
        : '';
    return (displayedAmount1 + ' ' + displayedAmount2).trim();
  }
}

export default new DisplayedAmount();
