import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {getDefaultTax, getTax, getWealthTax} from '../../libs/tax';

type Tax = {
  year: number;
  price: number;
  defaultTax: number;
  wealthTax: number;
  tax: number;
};

const TaxInfo = ({amount}: {amount: number}) => {
  const [increaseRate, setIncreaseRate] = useState(22);
  const [taxList, setTaxList] = useState<Tax[]>([]);

  useEffect(() => {
    const arr: Tax[] = [];
    let expectedPrice = amount * 0.7;
    for (let year = 2021; year <= 2023; year++) {
      arr.push({
        year,
        price: expectedPrice,
        defaultTax: getDefaultTax(expectedPrice / 10000),
        wealthTax: getWealthTax(expectedPrice / 10000),
        tax: getTax(expectedPrice / 10000),
      });
      expectedPrice *= 1 + increaseRate / 100;
    }
    setTaxList(arr);
  }, [amount, increaseRate]);

  return (
    <View style={{marginHorizontal: 20}}>
      <Text style={{fontSize: 16}}>보유세</Text>
      <View></View>
      <View></View>
    </View>
  );
};

export default TaxInfo;
