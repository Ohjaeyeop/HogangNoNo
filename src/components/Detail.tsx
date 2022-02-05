import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {DetailProps} from '../App';
import DealInfo from './detail/DealInfo';
import {color} from '../theme/color';

const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;

const Detail = ({navigation, route}: DetailProps) => {
  const {dealAmount, buildYear, name, area} = route.params;

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {Platform.OS === 'ios' && <View style={styles.statusBar} />}
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.pop()}>
          <Icon
            size={25}
            style={{
              color: 'white',
              width: '25%',
              textAlign: 'center',
              paddingHorizontal: 20,
            }}
            name="arrow-back"
          />
        </TouchableWithoutFeedback>
        <Text style={styles.title}>{name}</Text>
        <View style={{width: '25%'}} />
      </View>
      <View style={styles.subHeader}>
        <TouchableOpacity
          style={[
            styles.selectBox,
            {borderRightWidth: 0.2, borderRightColor: 'lightgray'},
          ]}>
          <Text style={styles.text}>매매</Text>
          <Icon name="keyboard-arrow-down" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectBox}>
          <Text style={styles.text}>{area}평</Text>
          <Icon name="keyboard-arrow-down" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <DealInfo
        dealAmount={dealAmount}
        area={area}
        buildYear={buildYear}
        name={name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: statusBarHeight,
    backgroundColor: color.main,
  },
  header: {
    backgroundColor: color.main,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderBottomWidth: 0.2,
    borderBottomColor: 'lightgray',
  },
  subHeader: {
    backgroundColor: color.main,
    height: 40,
    flexDirection: 'row',
  },
  selectBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    width: '50%',
    textAlign: 'center',
  },
  apartmentInfo: {
    padding: 12,
    borderBottomWidth: 10,
    borderColor: color.gray,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
});

export default Detail;
