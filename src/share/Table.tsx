import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

type Props = {
  columnNames: string[];
  tableData: string[][];
  boldColumns: number[];
  column: number;
};

const Table = ({columnNames, tableData, boldColumns, column}: Props) => {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {columnNames.map(name => (
          <View style={[styles.column, {flex: 1 / column}]}>
            <Text style={styles.text}>{name}</Text>
          </View>
        ))}
      </View>
      <ScrollView style={{width: '100%', maxHeight: 180}}>
        {tableData.map((row, index) => {
          return (
            <View style={styles.tableBody} key={index}>
              {row.map((data, index) => {
                return (
                  <View style={[styles.column, {flex: 1 / column}]} key={index}>
                    <Text
                      style={[
                        styles.text,
                        {
                          fontWeight: boldColumns.includes(index)
                            ? 'bold'
                            : undefined,
                        },
                      ]}>
                      {data}
                    </Text>
                  </View>
                );
              })}
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
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
  },
  tableBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.2,
  },
  column: {
    alignItems: 'center',
  },
  text: {
    color: 'black',
  },
});

export default Table;
