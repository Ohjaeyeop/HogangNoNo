import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import DealInfoGraph from './DealInfoGraph';
import DealList from './DealList';

const DealInfo = ({
  dealAmount,
  dealInfoList,
  dealInfoGroup,
}: {
  dealAmount: number;
  dealInfoList: ResultSetRowList | undefined;
  dealInfoGroup: ResultSetRowList | undefined;
}) => {
  const amount1 = Math.floor(dealAmount / 10000);
  const amount2 = dealAmount % 10000;
  const displayedAmount1 = amount1 > 0 ? `${amount1}억` : '';
  const displayedAmount2 =
    amount2 >= 1000
      ? amount2.toString().slice(0, 1) + ',' + amount2.toString().slice(1)
      : amount2 > 0
      ? amount2.toString()
      : '';

  return (
    <View>
      <View style={styles.dealInfoContainer}>
        <Text style={{color: '#835eeb', fontWeight: 'bold'}}>
          최근 실거래 기준 1개월 평균
        </Text>
        <Text style={{color: '#835eeb', fontSize: 20, fontWeight: 'bold'}}>
          {displayedAmount1 + ' ' + displayedAmount2}
        </Text>
        <DealInfoGraph />
        <DealList dealInfoList={dealInfoList} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dealInfoContainer: {
    padding: 15,
  },
  text: {
    color: '#835eeb',
  },
});

export default DealInfo;
