import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ResultSetRowList} from 'react-native-sqlite-storage';

const DealList = ({dealInfoList}: {dealInfoList: ResultSetRowList}) => {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text>계약일</Text>
        <Text>가격</Text>
        <Text>층</Text>
      </View>
      {Array.from({length: dealInfoList.length}, (v, i) => i).map(index => (
        <View style={styles.tableBody} key={index}>
          <Text>
            {dealInfoList.item(index).year}.{dealInfoList.item(index).month}.
            {dealInfoList.item(index).day}
          </Text>
          <Text>{dealInfoList.item(index).dealAmount}</Text>
          <Text>{dealInfoList.item(index).floor}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    alignItems: 'center',
    marginTop: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopColor: 'gray',
    borderBottomColor: 'gray',
  },
  tableBody: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.2,
  },
});

export default DealList;
