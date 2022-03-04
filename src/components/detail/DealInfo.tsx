import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DealInfoGraph from './DealInfoGraph';
import DealList from './DealList';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {displayedAmount} from '../../libs/displayedAmount';
import {color} from '../../theme/color';
import {Deal, GroupByDate} from '../../db/db';

type Props = {
  amount: number;
  area: number;
  buildYear: number;
  dealInfoList: Deal<'Deal' | 'Lease'>[];
  dealInfoGroup: GroupByDate[];
  modalOpen: () => void;
  areaChangingLoading: boolean;
  typeChangingLoading: boolean;
  type: 'Deal' | 'Lease';
  changeType: (type: 'Deal' | 'Lease') => void;
  onShare: () => Promise<void>;
};

const DealInfo = ({
  amount,
  area,
  buildYear,
  dealInfoList,
  dealInfoGroup,
  modalOpen,
  areaChangingLoading,
  typeChangingLoading,
  type,
  changeType,
  onShare,
}: Props) => {
  const {hundredMillion, tenMillion} = displayedAmount(amount);
  return (
    <View>
      <View style={styles.apartmentInfo}>
        <Text style={{fontSize: 14, color: 'black'}}>{buildYear}년</Text>
        <TouchableOpacity
          style={{height: '100%', width: 44, alignItems: 'center'}}
          onPress={() => onShare()}>
          <Icon name={'share'} size={20} color={color.main} />
        </TouchableOpacity>
      </View>
      <View style={styles.dealInfoContainer}>
        <View style={styles.selectorView}>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeBox,
                {backgroundColor: type === 'Deal' ? color.main : undefined},
              ]}
              onPress={() => type === 'Lease' && changeType('Deal')}>
              {type === 'Lease' && typeChangingLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={{color: type === 'Deal' ? 'white' : color.main}}>
                  매매
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeBox,
                {backgroundColor: type === 'Lease' ? color.main : undefined},
              ]}
              onPress={() => type === 'Deal' && changeType('Lease')}>
              {type === 'Deal' && typeChangingLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={{color: type === 'Lease' ? 'white' : color.main}}>
                  전월세
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.selectBox} onPress={modalOpen}>
            {areaChangingLoading ? (
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
            {`${hundredMillion} ${tenMillion}`.trim()}
          </Text>
        </View>
        <DealInfoGraph
          dealInfoGroup={dealInfoGroup}
          type={type}
          loading={areaChangingLoading || typeChangingLoading}
        />
        <DealList dealInfoList={dealInfoList} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dealInfoContainer: {
    padding: 20,
    borderBottomWidth: 10,
    borderColor: color.gray,
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
    paddingLeft: 20,
    borderBottomWidth: 10,
    borderColor: color.gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default DealInfo;
