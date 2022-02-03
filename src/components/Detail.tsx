import React, {useCallback, useEffect, useState} from 'react';
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
import {getAreaList, getDealInfo} from '../db/db';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import {useFocusEffect} from '@react-navigation/native';

const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;

const Detail = ({navigation, route}: DetailProps) => {
  const [dealInfoList, setDealInfoList] = useState<ResultSetRowList>(
    {} as ResultSetRowList,
  );
  const [dealInfoGroup, setDealInfoGroup] = useState<ResultSetRowList>(
    {} as ResultSetRowList,
  );
  const [areaList, setAreaList] = useState<ResultSetRowList>(
    {} as ResultSetRowList,
  );
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getDealInfo(route.params.name, route.params.area).then(res => {
        setDealInfoList(res.dealInfoList);
        setDealInfoGroup(res.dealInfoGroup);
      });
      getAreaList(route.params.name).then(res => setAreaList(res));
    }, [route.params.area, route.params.name]),
  );

  useEffect(() => {
    if (
      dealInfoList !== undefined &&
      dealInfoGroup !== undefined &&
      areaList !== undefined
    ) {
      setLoading(false);
    }
  }, [areaList, dealInfoGroup, dealInfoList]);

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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View>
          <View style={styles.apartmentInfo}>
            <Text style={styles.text}>{route.params.buildYear}년</Text>
          </View>
          <DealInfo
            dealAmount={route.params.dealAmount}
            area={route.params.area}
            areaList={areaList}
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
  apartmentInfo: {
    padding: 12,
    borderBottomWidth: 10,
    borderColor: '#D9D9D9',
  },
  text: {
    fontSize: 14,
  },
});

export default Detail;
