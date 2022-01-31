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
  dealInfoList: ResultSetRowList;
  dealInfoGroup: ResultSetRowList;
}) => {
  console.log(dealInfoList.length, dealInfoGroup.length);

  return (
    <View>
      <View style={styles.dealInfoContainer}>
        <Text style={{color: '#835eeb', fontWeight: 'bold'}}>
          최근 실거래 기준 1개월 평균
        </Text>
        <Text style={{color: '#835eeb', fontSize: 20, fontWeight: 'bold'}}>
          {dealAmount}
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
