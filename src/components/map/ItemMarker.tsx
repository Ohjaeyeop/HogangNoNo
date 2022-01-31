import React from 'react';
import {
  ImageBackground,
  Platform,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {Align, Marker} from 'react-native-nmap';
import {ApartmentType, DongType, GuType} from '../../db/db';
import {useNavigation} from '@react-navigation/native';
import {HomeProps} from '../../App';

const ItemMarker = ({item}: {item: ApartmentType | DongType | GuType}) => {
  const navigation = useNavigation<HomeProps['navigation']>();

  const handlePress = () => {
    if ('buildYear' in item) {
      navigation.navigate('Detail', {
        name: item.name,
        dealAmount: item.dealAmount,
        buildYear: item.buildYear,
        area: item.area,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      {Platform.OS === 'android' ? (
        <Marker
          coordinate={{latitude: item.latitude, longitude: item.longitude}}
          width={64}
          height={54}
          anchor={{x: -1, y: 1}}>
          <ImageBackground
            source={require('../../../assets/images/marker.png')}
            resizeMode="stretch"
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#9aa7b8', fontSize: 12}}>
              {'area' in item
                ? `${item.area}평`
                : 'gu' in item
                ? item.name.split(' ')[1]
                : item.name}
            </Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {item.dealAmount}억
            </Text>
          </ImageBackground>
        </Marker>
      ) : (
        <Marker
          image={require('../../../assets/images/marker.png')}
          coordinate={{
            latitude: item.latitude,
            longitude: item.longitude,
          }}
          width={64}
          height={54}
          anchor={{x: -1, y: 1}}
          caption={{
            text:
              'area' in item
                ? `${item.area}평`
                : 'gu' in item
                ? item.name.split(' ')[1]
                : item.name,
            textSize: 12,
            color: '#9aa7b8',
            align: Align.Center,
            haloColor: 'transparent',
          }}
          subCaption={{
            text: `${item.dealAmount}억`,
            color: 'white',
            haloColor: 'transparent',
          }}
        />
      )}
    </TouchableWithoutFeedback>
  );
};

export default ItemMarker;
