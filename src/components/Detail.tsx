import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
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
import Modal from 'react-native-modalbox';
import {getAreaList, getDealInfo, getRecentDealAmount} from '../db/db';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import {useFocusEffect} from '@react-navigation/native';

const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;

const Detail = ({navigation, route}: DetailProps) => {
  const {dealAmount, buildYear, name, area} = route.params;
  const [selectedArea, setArea] = useState(area);
  const [amount, setAmount] = useState(dealAmount);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);

  const [areaList, setAreaList] = useState<ResultSetRowList>();
  const [dealInfoList, setDealInfoList] = useState<ResultSetRowList>();
  const [dealInfoGroup, setDealInfoGroup] = useState<ResultSetRowList>();

  const modalRef = useRef<Modal>(null);

  const changeArea = (name: string, area: number) => {
    setLoading2(true);
    getDealInfo('Deal', name, area)
      .then(res => {
        setDealInfoList(res.dealInfoList);
        setDealInfoGroup(res.dealInfoGroup);
      })
      .then(() => setLoading2(false));
    getRecentDealAmount(name, area).then(res => setAmount(res));
    setArea(area);
    modalRef.current?.close();
  };

  const modalOpen = () => {
    modalRef.current?.open();
  };

  useFocusEffect(
    useCallback(() => {
      getDealInfo('Deal', name, area).then(res => {
        setDealInfoList(res.dealInfoList);
        setDealInfoGroup(res.dealInfoGroup);
      });
      getAreaList(name).then(res => setAreaList(res));
    }, [area, name]),
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

  return loading || !dealInfoGroup || !dealInfoList || !areaList ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
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
        <TouchableOpacity style={styles.selectBox} onPress={modalOpen}>
          <Text style={styles.text}>{selectedArea}평</Text>
          <Icon name="keyboard-arrow-down" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <DealInfo
        amount={amount}
        area={selectedArea}
        buildYear={buildYear}
        dealInfoList={dealInfoList}
        dealInfoGroup={dealInfoGroup}
        modalOpen={modalOpen}
        loading={loading2}
      />
      <Modal
        entry="bottom"
        position="bottom"
        swipeToClose={false}
        coverScreen={true}
        backdropOpacity={0.2}
        ref={modalRef}
        style={{
          height: '50%',
          backgroundColor: 'white',
          padding: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>평형 선택</Text>
          <Icon
            name={'close'}
            size={20}
            onPress={() => modalRef.current?.close()}
          />
        </View>
        <ScrollView>
          {[...new Array(areaList.length).keys()].map(index => {
            const area = areaList.item(index).area;
            return (
              <TouchableOpacity
                key={index}
                style={{
                  paddingVertical: 20,
                  borderBottomWidth: 0.2,
                  borderBottomColor: 'gray',
                }}
                onPress={() => {
                  changeArea(name, area);
                }}>
                <Text
                  style={[
                    {fontWeight: 'bold', fontSize: 18},
                    area === selectedArea ? {color: color.main} : null,
                  ]}>
                  {area}평
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Modal>
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
