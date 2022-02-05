import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modalbox';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import DealInfoGraph from './DealInfoGraph';
import DealList from './DealList';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import {getAreaList, getDealInfo, getRecentDealAmount} from '../../db/db';
import {displayedAmount} from '../../libs/displayedAmount';
import {color} from '../../theme/color';

type Props = {
  dealAmount: number;
  area: number;
  buildYear: number;
  name: string;
};

const DealInfo = (props: Props) => {
  const {dealAmount, area, buildYear, name} = props;
  const modalRef = useRef<Modal>(null);
  const [selectedArea, setArea] = useState(area);
  const [amount, setAmount] = useState(dealAmount);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [type, setType] = useState('Deal');

  const [dealInfoList, setDealInfoList] = useState<ResultSetRowList>();
  const [dealInfoGroup, setDealInfoGroup] = useState<ResultSetRowList>();
  const [areaList, setAreaList] = useState<ResultSetRowList>();

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
    <View>
      <View style={styles.apartmentInfo}>
        <Text style={{fontSize: 14}}>{buildYear}년</Text>
      </View>
      <View style={styles.dealInfoContainer}>
        <View style={styles.selectorView}>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeBox,
                {backgroundColor: type === 'Deal' ? color.main : undefined},
              ]}
              onPress={() => setType('Deal')}>
              <Text style={{color: type === 'Deal' ? 'white' : color.main}}>
                매매
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeBox,
                {backgroundColor: type === 'Lease' ? color.main : undefined},
              ]}
              onPress={() => setType('Lease')}>
              <Text style={{color: type === 'Lease' ? 'white' : color.main}}>
                전월세
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => modalRef.current?.open()}>
            {loading2 ? (
              <ActivityIndicator />
            ) : (
              <Text style={[styles.text, {marginRight: 10}]}>
                {selectedArea}평
              </Text>
            )}
            <Icon name={'arrow-drop-down'} size={20} color={color.main} />
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: 30}}>
          <Text style={{color: color.main, fontWeight: 'bold'}}>
            최근 실거래 기준 1개월 평균
          </Text>
          <Text style={{color: color.main, fontSize: 20, fontWeight: 'bold'}}>
            {displayedAmount(amount)}
          </Text>
        </View>
        <DealInfoGraph dealInfoGroup={dealInfoGroup} />
        <DealList dealInfoList={dealInfoList} />
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
                      area === selectedArea ? styles.text : null,
                    ]}>
                    {area}평
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Modal>
      </View>
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
    backgroundColor: color.gray,
  },
  typeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 2,
    borderColor: color.main,
    paddingVertical: 5,
    width: 75,
  },
  text: {
    color: color.main,
  },
  apartmentInfo: {
    padding: 12,
    borderBottomWidth: 10,
    borderColor: color.gray,
  },
});

export default DealInfo;
