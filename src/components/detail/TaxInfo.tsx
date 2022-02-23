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
import {calculateGraphAxisInfo} from '../../libs/calculateGraphAxisInfo';

type Tax = {
  year: number;
  price: number;
  defaultTax: number;
  wealthTax: number;
  tax: number;
};

const graphWidth = (Dimensions.get('window').width - 40) * 0.8;
const graphHeight = 80;
const barWidth = 30;
const gap = (graphWidth - barWidth * 3) / 3 + barWidth;

const TaxInfo = ({amount}: {amount: number}) => {
  const columnNames = ['년도', '공시가', '재산세', '종부세', '합계'];
  const boldColumns = [1, 4];
  const [increaseRate, setIncreaseRate] = useState(22);
  const [expectedTaxList, setExpectedTaxList] = useState<Tax[]>([]);
  const [tableData, setTableData] = useState<string[][]>([[]]);
  const [line, setLine] = useState(0);
  const [axisGap, setAxisGap] = useState(0);
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

  const getTaxText = (amount: number) => {
    const {hundredMillion, tenThousand} = displayedAmount(amount);
    return hundredMillion + tenThousand;
  };

  const changeRate = (rate: number) => {
    setIncreaseRate(rate);
  };

  useEffect(() => {
    const taxList = getTaxList(amount, increaseRate);
    maximum.current = calculateGraphAxisInfo(taxList[2].tax).maxValue;
    setLine(calculateGraphAxisInfo(taxList[2].tax).line);
    setAxisGap(calculateGraphAxisInfo(taxList[2].tax).gap);
    defaultPath.current = getGraphPath(
      maximum.current,
      maximum.current,
      gap,
      graphHeight,
      taxList.map(tax => tax.tax),
      gap / 2,
      'Q',
    );
    wealthPath.current = getGraphPath(
      maximum.current,
      maximum.current,
      gap,
      graphHeight,
      taxList.map(tax => tax.wealthTax),
      gap / 2,
      'Q',
    );
    setExpectedTaxList(taxList);
    setTableData(
      taxList.map(data => {
        const year = data.year.toString();
        const price = getTaxText(data.price);
        const defaultTax =
          data.defaultTax > 0 ? getTaxText(data.defaultTax) + '만' : '없음';
        const wealthTax =
          data.wealthTax > 0 ? getTaxText(data.wealthTax) + '만' : '없음';
        const tax =
          data.tax >= 10000
            ? displayedAmount(data.tax).tenThousand
              ? getTaxText(data.tax) + '만'
              : getTaxText(data.tax)
            : getTaxText(data.tax) + '만원';
        return [year, price, defaultTax, wealthTax, tax];
      }),
    );
  }, [amount, increaseRate]);

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 16, marginBottom: 20}}>보유세</Text>
      <View
        style={{
          width: '100%',
          marginBottom: 40,
          alignItems: 'flex-end',
          right: 10,
        }}>
        <View
          style={{
            width: graphWidth,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 15,
          }}>
          <Text style={{fontSize: 12, color: color.main}}>종부세 </Text>
          <Text style={{fontSize: 12, color: '#FA6400'}}> 재산세</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              alignItems: 'flex-end',
              height: graphHeight + 2,
              marginRight: 5,
            }}>
            {[...new Array(line).keys()].map(index => (
              <Text
                style={{
                  position: 'absolute',
                  color: 'gray',
                  fontSize: 12,
                  top:
                    graphHeight -
                    ((graphHeight * axisGap) / maximum.current) * index -
                    6,
                }}
                key={index}>
                {index === 0
                  ? 0
                  : displayedAmount(axisGap * index).tenThousand
                  ? axisGap * index > 10000
                    ? `${getTaxText(axisGap * index)}만`
                    : `${getTaxText(axisGap * index)}만원`
                  : getTaxText(axisGap * index)}
              </Text>
            ))}
          </View>
          <Svg
            height={graphHeight + 2}
            width={graphWidth}
            viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
            <GraphBackground
              graphHeight={graphHeight}
              graphWidth={graphWidth}
              line={line}
              maxValue={maximum.current}
              gap={axisGap}
            />
            <Path
              d={defaultPath.current}
              fill="none"
              stroke={'#FA6400'}
              strokeWidth={2}
            />
            <Path
              d={wealthPath.current}
              fill="none"
              stroke={color.main}
              strokeWidth={2}
            />
            <View style={styles.chartContainer}>
              {expectedTaxList.map((taxObj, index) => {
                return (
                  <View key={index}>
                    <View
                      style={{
                        width: barWidth,
                        height: Math.round(
                          (graphHeight * taxObj.defaultTax) / maximum.current,
                        ),
                        backgroundColor: '#FA6400',
                      }}
                    />
                    <View
                      style={{
                        width: barWidth,
                        height: Math.round(
                          (graphHeight * taxObj.wealthTax) / maximum.current,
                        ),
                        backgroundColor: color.main,
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        bottom: -20,
                        width: 40,
                        left: (barWidth - 40) / 2,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        {taxObj.year}년
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Svg>
        </View>
      </View>
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
            changeRate={changeRate}
          />
        </View>
      </View>
      <Table
        columnNames={columnNames}
        boldColumns={boldColumns}
        tableData={tableData}
        flexes={[1, 2, 1.7, 2, 2]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    width: graphWidth,
    height: graphHeight + 1,
    borderBottomWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
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
