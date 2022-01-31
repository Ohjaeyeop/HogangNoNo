import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {DetailProps} from '../App';
import DealInfo from './DealInfo';
import ApartmentInfo from './ApartmentInfo';

const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;

const Detail = ({navigation, route}: DetailProps) => {
  return (
    <View style={{flex: 1}}>
      {Platform.OS === 'ios' && <View style={styles.statusBar} />}
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.pop()}>
          <Icon
            size={25}
            style={{color: 'white', width: '25%', textAlign: 'center'}}
            name="arrow-back"
          />
        </TouchableWithoutFeedback>
        <Text style={styles.title}>{route.params.name}</Text>
        <View style={{width: '25%'}} />
      </View>
      <View>
        <ApartmentInfo buildYear={route.params.buildYear} />
        <DealInfo dealAmount={route.params.dealAmount} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: statusBarHeight,
    backgroundColor: '#835eeb',
  },
  header: {
    backgroundColor: '#835eeb',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    width: '50%',
    textAlign: 'center',
  },
});

export default Detail;
