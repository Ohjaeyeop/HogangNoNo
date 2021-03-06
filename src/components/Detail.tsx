import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  unstable_batchedUpdates,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {DetailProps} from '../App';
import DealInfo from './detail/DealInfo';
import {color} from '../theme/color';
import Modal from 'react-native-modalbox';
import {Deal, getAreaList, getDealInfo, GroupByDate} from '../db/db';
import {StackActions, useFocusEffect} from '@react-navigation/native';
import TaxInfo from './detail/TaxInfo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const rowHeight = 70;

const Detail = ({navigation, route}: DetailProps) => {
  const safeArea = useSafeAreaInsets();
  const {dealAmount, buildYear, name, area} = route.params;
  const [selectedArea, setArea] = useState(area);
  const [amount, setAmount] = useState(dealAmount);
  const [loading, setLoading] = useState(true);
  const [areaChangingLoading, setAreaChangingLoading] = useState(false);
  const [typeChangingLoading, setTypeChangingLoading] = useState(false);
  const [type, setType] = useState<'Deal' | 'Lease'>('Deal');

  const [areaList, setAreaList] = useState<number[]>([]);
  const [dealInfoList, setDealInfoList] = useState<Deal<typeof type>[]>();
  const [dealInfoGroup, setDealInfoGroup] = useState<GroupByDate[]>();

  const typeModalRef = useRef<Modal>(null);
  const areaModalRef = useRef<Modal>(null);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: encodeURI(
          `hohoho://detail/${name.replace(
            ' ',
            '',
          )}/${dealAmount}/${buildYear}/${area}`,
        )
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29'),
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

  const getData = async (
    type: 'Deal' | 'Lease',
    name: string,
    selectedArea: number,
  ) => {
    await getDealInfo(type, name, selectedArea).then(res => {
      unstable_batchedUpdates(() => {
        setDealInfoList(res.dealInfoList);
        setDealInfoGroup(res.dealInfoGroup);
        setAmount(res.recentDealAmount);
      });
    });
  };

  const changeArea = (area: number) => {
    setAreaChangingLoading(true);
    getData(type, name, area)
      .then(() => setArea(area))
      .then(() => setAreaChangingLoading(false));

    areaModalRef.current?.close();
  };

  const changeType = (type: 'Deal' | 'Lease') => {
    setTypeChangingLoading(true);
    getData(type, name, selectedArea).then(() => {
      unstable_batchedUpdates(() => {
        setTypeChangingLoading(false);
        setType(type);
      });
    });
    typeModalRef.current?.close();
  };

  const modalOpen = () => {
    areaModalRef.current?.open();
  };

  useFocusEffect(
    useCallback(() => {
      getData('Deal', name, area);
      getAreaList(name).then(res => setAreaList(res));
    }, [name, area]),
  );

  useEffect(() => {
    if (
      dealInfoList !== undefined &&
      dealInfoGroup !== undefined &&
      areaList.length !== 0
    ) {
      setLoading(false);
    }
  }, [areaList, dealInfoGroup, dealInfoList]);

  const handleBackButton = () => {
    if (navigation.canGoBack()) {
      navigation.pop();
    } else {
      navigation.dispatch(StackActions.replace('Home'));
    }
  };

  return loading || !dealInfoGroup || !dealInfoList || !areaList.length ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {Platform.OS === 'ios' && (
        <View
          style={{
            height: safeArea.top,
            backgroundColor: color.main,
          }}
        />
      )}
      <View style={styles.header}>
        <View
          style={{
            width: '60%',
            height: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleBackButton()}
          style={{position: 'absolute', left: 20, width: 44}}>
          <Icon
            size={25}
            style={{
              color: 'white',
              textAlign: 'center',
            }}
            name="arrow-back"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.subHeader}>
        <TouchableOpacity
          style={[
            styles.selectBox,
            {borderRightWidth: 0.2, borderRightColor: 'lightgray'},
          ]}
          onPress={() => typeModalRef.current?.open()}>
          <Text style={styles.text}>{type === 'Deal' ? '??????' : '?????????'}</Text>
          <Icon name="keyboard-arrow-down" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectBox} onPress={modalOpen}>
          <Text style={styles.text}>{selectedArea}???</Text>
          <Icon name="keyboard-arrow-down" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <DealInfo
          amount={amount}
          area={selectedArea}
          buildYear={buildYear}
          dealInfoList={dealInfoList}
          dealInfoGroup={dealInfoGroup}
          modalOpen={modalOpen}
          areaChangingLoading={areaChangingLoading}
          typeChangingLoading={typeChangingLoading}
          type={type}
          changeType={changeType}
          onShare={onShare}
        />
        <TaxInfo amount={dealAmount} />
      </ScrollView>
      <Modal
        animationDuration={0}
        position="center"
        swipeToClose={false}
        coverScreen={true}
        backdropOpacity={0.6}
        ref={typeModalRef}
        style={{
          width: 150,
          height: 100,
          backgroundColor: 'transparent',
          justifyContent: 'space-between',
        }}>
        <Pressable style={styles.typeModal} onPress={() => changeType('Deal')}>
          <Text
            style={{
              fontSize: 16,
              color: type === 'Deal' ? color.main : 'gray',
            }}>
            ??????
          </Text>
        </Pressable>
        <Pressable style={styles.typeModal} onPress={() => changeType('Lease')}>
          <Text
            style={{
              fontSize: 16,
              color: type === 'Lease' ? color.main : 'gray',
            }}>
            ?????????
          </Text>
        </Pressable>
      </Modal>
      <Modal
        entry="bottom"
        position="bottom"
        swipeToClose={false}
        coverScreen={true}
        backdropOpacity={0.2}
        ref={areaModalRef}
        style={{
          height:
            areaList.length >= 5 ? '50%' : rowHeight * (areaList.length + 1),
          backgroundColor: 'white',
          padding: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <Text style={styles.modalText}>?????? ??????</Text>
          <TouchableOpacity
            style={{
              width: 44,
              alignItems: 'center',
              position: 'absolute',
              right: -10,
            }}
            onPress={() => areaModalRef.current?.close()}>
            <Icon name={'close'} size={20} />
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentOffset={{x: 0, y: areaList.indexOf(selectedArea) * rowHeight}}>
          {areaList.map((area, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  height: rowHeight,
                  paddingVertical: 20,
                  borderBottomWidth: 0.2,
                  borderBottomColor: 'gray',
                }}
                onPress={() => {
                  changeArea(area);
                }}>
                <Text
                  style={[
                    styles.modalText,
                    area === selectedArea ? {color: color.main} : null,
                  ]}>
                  {area}???
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
  typeModal: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Detail;
