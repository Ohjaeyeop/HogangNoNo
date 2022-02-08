import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {getDefaultTax, getTax, getWealthTax} from '../../libs/tax';
import Table from '../../share/Table';
import {displayedAmount} from '../../libs/displayedAmount';
import Svg, {Path} from 'react-native-svg';
import {color} from '../../theme/color';
import GraphBackground from './GraphBackground';
import {getGraphPath} from '../../libs/getGraphPath';
import Slider from '../../share/Slider';

type Tax = {
  year: number;
  price: number;
  defaultTax: number;
  wealthTax: number;
  tax: number;
};

const graphWidth = Dimensions.get('window').width - 40 - 40;
const chartWidth = Dimensions.get('window').width * 0.6;
const chartHeight = 80;
const barWidth = 20;
const gap = (chartWidth - barWidth * 4) / 2;

const TaxInfo = ({amount}: {amount: number}) => {
  const columnNames = ['년도', '공시가', '재산세', '종부세', '합계'];
  const boldColumns = [1, 4];
  const column = 5;
  const [increaseRate, setIncreaseRate] = useState(22);
  const [expectedTaxList, setExpectedTaxList] = useState<Tax[]>([]);
  const [tableData, setTableData] = useState<string[][]>([[]]);
  const maximum = useRef(0);
  const defaultPath = useRef('');
  const wealthPath = useRef('');

  const getTaxList = (amount: number, increaseRate: number) => {
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

    return taxList;
  };

  useEffect(() => {
    const taxList = getTaxList(amount, increaseRate);
    maximum.current =
      Math.ceil(Math.max(...taxList.map(value => value.tax)) / 10) * 10;
    defaultPath.current = getGraphPath(
      maximum.current,
      maximum.current,
      gap,
      chartHeight,
      taxList.map(tax => tax.tax),
      barWidth * 2,
      'L',
    );
    wealthPath.current = getGraphPath(
      maximum.current,
      maximum.current,
      gap,
      chartHeight,
      taxList.map(tax => tax.wealthTax),
      barWidth * 2,
      'L',
    );
    setExpectedTaxList(taxList);
    setTableData(
      taxList.map(data => {
        const year = data.year.toString();
        const price = displayedAmount(data.price);
        const defaultTax = `${data.defaultTax}만`;
        const wealthTax = data.wealthTax > 0 ? `${data.wealthTax}만` : '없음';
        const tax = `${data.tax}만원`;
        return [year, price, defaultTax, wealthTax, tax];
      }),
    );
  }, [amount, increaseRate]);

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 16, marginBottom: 20}}>보유세</Text>
      <View
        style={{
          width: chartWidth,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginBottom: 15,
        }}>
        <Text style={{fontSize: 12, color: color.main}}>종부세 </Text>
        <Text style={{fontSize: 12, color: '#FA6400'}}> 재산세</Text>
      </View>
      <Svg height={chartHeight} width={graphWidth} style={{marginBottom: 30}}>
        <GraphBackground
          graphHeight={chartHeight}
          graphWidth={chartWidth}
          line={4}
        />
        <Path d={defaultPath.current} fill="none" stroke={'#FA6400'} />
        <Path d={wealthPath.current} fill="none" stroke={color.main} />
        <View style={styles.chartContainer}>
          {expectedTaxList.map((taxObj, index) => {
            return (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: barWidth * 1.5 + gap * index,
                  width: barWidth,
                }}>
                <View
                  style={{
                    height: (chartHeight * taxObj.defaultTax) / maximum.current,
                    backgroundColor: '#FA6400',
                  }}
                />
                <View
                  style={{
                    height: (chartHeight * taxObj.wealthTax) / maximum.current,
                    backgroundColor: color.main,
                  }}
                />
              </View>
            );
          })}
        </View>
      </Svg>
      <View style={styles.taxInfo}>
        <View>
          <Text style={styles.text}>2022년 예상 세금</Text>
          <Text style={styles.boldText}>
            {tableData.length > 1 && tableData[1][4]}
          </Text>
        </View>
        <View>
          <Text style={styles.text}>공시가격 예상 상승율</Text>
          <Text style={styles.boldText}>{`${increaseRate}%`}</Text>
          <Slider
            height={7}
            width={140}
            maxValue={50}
            startValue={22}
            setIncreaseRate={setIncreaseRate}
          />
        </View>
      </View>
      <Table
        columnNames={columnNames}
        boldColumns={boldColumns}
        tableData={tableData}
        column={column}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    width: chartWidth,
    height: chartHeight,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  taxInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  text: {
    color: 'black',
  },
  boldText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    paddingVertical: 7,
  },
});

export default TaxInfo;
