import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {getDefaultTax, getTax, getWealthTax} from '../../libs/tax';
import Table from '../../share/Table';
import {displayedAmount} from '../../libs/displayedAmount';

type Tax = {
  year: number;
  price: number;
  defaultTax: number;
  wealthTax: number;
  tax: number;
};

const TaxInfo = ({amount}: {amount: number}) => {
  const columnNames = ['년도', '공시가', '재산세', '종부세', '합계'];
  const boldColumns = [1, 4];
  const column = 5;
  const [increaseRate, setIncreaseRate] = useState(22);
  const [tableData, setTableData] = useState<string[][]>([[]]);

  useEffect(() => {
    const taxList: Tax[] = [];
    let expectedPrice = amount * 0.7;
    for (let year = 2021; year <= 2023; year++) {
      taxList.push({
        year,
        price: expectedPrice,
        defaultTax: getDefaultTax(expectedPrice / 10000),
        wealthTax: getWealthTax(expectedPrice / 10000),
        tax: getTax(expectedPrice / 10000),
      });
      expectedPrice *= 1 + increaseRate / 100;
    }
    setTableData(
      taxList.map(data => {
        const year = data.year.toString();
        const price = displayedAmount(data.price);
        const defaultTax = `${data.defaultTax}만`;
        const wealthTax = `${data.wealthTax}만`;
        const tax = `${data.tax}만원`;
        return [year, price, defaultTax, wealthTax, tax];
      }),
    );
  }, [amount, increaseRate]);

  return (
    <View style={{marginHorizontal: 20}}>
      <Text style={{fontSize: 16, marginBottom: 40}}>보유세</Text>
      <View></View>
      <Table
        columnNames={columnNames}
        boldColumns={boldColumns}
        tableData={tableData}
        column={column}
      />
    </View>
  );
};

export default TaxInfo;
