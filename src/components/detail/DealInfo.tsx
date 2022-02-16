import React from 'react';
import {
  ActivityIndicator,
  Share,
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
  const {hundredMillion, tenMillion} = displayedAmount(amount);
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Test',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <View style={styles.apartmentInfo}>
        <Text style={{fontSize: 14, color: 'black'}}>{buildYear}년</Text>
        <Icon name={'share'} size={20} color={color.main} onPress={onShare} />
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
              {type === 'Deal' && loading2 ? (
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
              onPress={() => changeType('Lease')}>
              {type === 'Lease' && loading2 ? (
                <ActivityIndicator />
              ) : (
                <Text style={{color: type === 'Lease' ? 'white' : color.main}}>
                  전월세
                </Text>
              )}
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
            {hundredMillion ? `${hundredMillion} ${tenMillion}` : tenMillion}
          </Text>
        </View>
        <DealInfoGraph
          dealInfoGroup={dealInfoGroup}
          type={type}
          loading={loading1 || loading2}
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
    paddingHorizontal: 20,
    borderBottomWidth: 10,
    borderColor: color.gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default DealInfo;
