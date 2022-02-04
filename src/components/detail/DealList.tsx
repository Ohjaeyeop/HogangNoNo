import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import {displayedAmount} from '../../libs/displayedAmount';

const DealList = ({dealInfoList}: {dealInfoList: ResultSetRowList}) => {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <View style={styles.column}>
          <Text>계약일</Text>
        </View>
        <View style={styles.column}>
          <Text>가격</Text>
        </View>
        <View style={styles.column}>
          <Text>층</Text>
        </View>
      </View>
      <ScrollView style={{width: '100%', height: '50%'}}>
        {Array.from({length: dealInfoList.length}, (v, i) => i).map(index => {
          return (
            <View style={styles.tableBody} key={index}>
              <View style={styles.column}>
                <Text>
                  {dealInfoList.item(index).year}.
                  {dealInfoList.item(index).month < 10
                    ? `0${dealInfoList.item(index).month}`
                    : dealInfoList.item(index).month}
                  .
                  {dealInfoList.item(index).day < 10
                    ? `0${dealInfoList.item(index).day}`
                    : dealInfoList.item(index).day}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={{fontWeight: 'bold'}}>
                  {displayedAmount(dealInfoList.item(index).dealAmount)}
                </Text>
              </View>
              <View style={styles.column}>
                <Text>{dealInfoList.item(index).floor}층</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
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
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.2,
  },
  column: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});

export default DealList;
