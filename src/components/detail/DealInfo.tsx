import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import DealInfoGraph from './DealInfoGraph';
import DealList from './DealList';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    <View style={styles.dealInfoContainer}>
      <View style={styles.selectorView}>
        <TouchableOpacity style={styles.typeSelector}>
          <View style={styles.typeBox}>
            <Text>매매</Text>
          </View>
          <View style={styles.typeBox}>
            <Text>전월세</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectBox}>
          <Text style={styles.text}>24평</Text>
          <Icon name={'arrow-drop-down'} size={20} color={'#835eeb'} />
        </TouchableOpacity>
      </View>
      <Text style={{color: '#835eeb', fontWeight: 'bold'}}>
        최근 실거래 기준 1개월 평균
      </Text>
      <Text style={{color: '#835eeb', fontSize: 20, fontWeight: 'bold'}}>
        {displayedAmount1 + ' ' + displayedAmount2}
      </Text>
      <DealInfoGraph dealInfoGroup={dealInfoGroup} />
      <DealList dealInfoList={dealInfoList} />
    </View>
  );
};

const styles = StyleSheet.create({
  dealInfoContainer: {
    padding: 20,
  },
  selectorView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
  },
  typeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    width: 60,
    backgroundColor: '#D9D9D9',
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 2,
    borderColor: '#835eeb',
    paddingVertical: 5,
    width: 70,
  },
  text: {
    color: '#835eeb',
  },
});

export default DealInfo;
