import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import DealInfoGraph from './DealInfoGraph';
import DealList from './DealList';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {displayedAmount} from '../../libs/displayedAmount';
import {color} from '../../theme/color';

type Props = {
  amount: number;
  area: number;
  buildYear: number;
  dealInfoList: ResultSetRowList;
  dealInfoGroup: ResultSetRowList;
  modalOpen: () => void;
  loading1: boolean;
  loading2: boolean;
  type: 'Deal' | 'Lease';
  changeType: (type: 'Deal' | 'Lease') => void;
};

const DealInfo = ({
  amount,
  area,
  buildYear,
  dealInfoList,
  dealInfoGroup,
  modalOpen,
  loading1,
  loading2,
  type,
  changeType,
}: Props) => {
  return (
    <View>
      <View style={styles.apartmentInfo}>
        <Text style={{fontSize: 14, color: 'black'}}>{buildYear}년</Text>
      </View>
      <View style={styles.dealInfoContainer}>
        <View style={styles.selectorView}>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeBox,
                {backgroundColor: type === 'Deal' ? color.main : undefined},
              ]}
              onPress={() => changeType('Deal')}>
              <Text style={{color: type === 'Deal' ? 'white' : color.main}}>
                매매
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeBox,
                {backgroundColor: type === 'Lease' ? color.main : undefined},
              ]}
              onPress={() => changeType('Lease')}>
              <Text style={{color: type === 'Lease' ? 'white' : color.main}}>
                전월세
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.selectBox} onPress={modalOpen}>
            {loading1 ? (
              <ActivityIndicator />
            ) : (
              <Text style={[styles.text, {marginRight: 10}]}>{area}평</Text>
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
        <DealInfoGraph
          dealInfoGroup={dealInfoGroup}
          type={type}
          loading={loading2}
        />
        <DealList dealInfoList={dealInfoList} />
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
