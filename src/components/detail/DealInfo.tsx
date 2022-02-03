import React, {useImperativeHandle, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modalbox';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import DealInfoGraph from './DealInfoGraph';
import DealList from './DealList';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  dealAmount: number;
  area: number;
  dealInfoList: ResultSetRowList | undefined;
  dealInfoGroup: ResultSetRowList | undefined;
  areaList: ResultSetRowList | undefined;
};

export type ModalRef = {
  isVisible: () => boolean | undefined;
  closeModal: () => void;
};

const DealInfo = (props: Props, ref: React.Ref<ModalRef>) => {
  const {dealAmount, area, dealInfoList, dealInfoGroup, areaList} = props;
  const modalRef = useRef<Modal>(null);
  const [selectedArea, setArea] = useState(area);
  const [modalVisible, setModalVisible] = useState(false);
  const amount1 = Math.floor(dealAmount / 10000);
  const amount2 = dealAmount % 10000;
  const displayedAmount1 = amount1 > 0 ? `${amount1}억` : '';
  const displayedAmount2 =
    amount2 >= 1000
      ? amount2.toString().slice(0, 1) + ',' + amount2.toString().slice(1)
      : amount2 > 0
      ? amount2.toString()
      : '';

  useImperativeHandle(ref, () => ({}), [modalRef]);

  return (
    <View style={styles.dealInfoContainer}>
      <View style={styles.selectorView}>
        <TouchableOpacity style={styles.typeSelector}>
          <View style={styles.typeBox}>
            <Text>매매</Text>
          </View>
          <View style={styles.typeBox}>
            <Text>전월세</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => modalRef.current?.open()}>
          <Text style={[styles.text, {marginRight: 10}]}>{selectedArea}평</Text>
          <Icon name={'arrow-drop-down'} size={20} color={'#835eeb'} />
        </TouchableOpacity>
      </View>
      <Text style={{color: '#835eeb', fontWeight: 'bold'}}>
        최근 실거래 기준 1개월 평균
      </Text>
      <Text style={{color: '#835eeb', fontSize: 20, fontWeight: 'bold'}}>
        {displayedAmount1 + ' ' + displayedAmount2}
      </Text>
      <DealInfoGraph dealInfoGroup={dealInfoGroup} />
      <DealList dealInfoList={dealInfoList} />
      <Modal
        entry="bottom"
        position="bottom"
        swipeToClose={false}
        coverScreen={true}
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
          }}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>평형 선택</Text>
          <Icon
            name={'close'}
            size={20}
            onPress={() => modalRef.current?.close()}
          />
        </View>
      </Modal>
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
  },
  typeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    width: 60,
    backgroundColor: '#D9D9D9',
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 2,
    borderColor: '#835eeb',
    paddingVertical: 5,
    width: 75,
  },
  text: {
    color: '#835eeb',
  },
});

export default React.forwardRef(DealInfo);
