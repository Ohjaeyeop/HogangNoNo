import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ApartmentInfo = ({buildYear}: {buildYear: number}) => {
  return (
    <View style={styles.apartmentInfo}>
      <Text style={styles.text}>{buildYear}년</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  apartmentInfo: {
    padding: 12,
    borderBottomWidth: 10,
    borderColor: '#D9D9D9',
  },
  text: {
    fontSize: 14,
  },
});

export default ApartmentInfo;
