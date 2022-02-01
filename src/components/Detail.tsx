import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {DetailProps} from '../App';
import DealInfo from './detail/DealInfo';
import ApartmentInfo from './detail/ApartmentInfo';
import {getDealInfo} from '../db/db';
import {ResultSetRowList} from 'react-native-sqlite-storage';

const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;

const Detail = ({navigation, route}: DetailProps) => {
  const [dealInfoList, setDealInfoList] = useState<ResultSetRowList>();
  const [dealInfoGroup, setDealInfoGroup] = useState<ResultSetRowList>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDealInfo(route.params.name, route.params.area).then(res => {
      setDealInfoList(res.dealInfoList);
      setDealInfoGroup(res.dealInfoGroup);
      setLoading(false);
    });
  }, [route.params.name, route.params.area]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
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
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <ApartmentInfo buildYear={route.params.buildYear} />
          <DealInfo
            dealAmount={route.params.dealAmount}
            dealInfoList={dealInfoList}
            dealInfoGroup={dealInfoGroup}
          />
        </View>
      )}
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
