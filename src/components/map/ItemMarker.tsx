import React from 'react';
import {
  ImageBackground,
  Platform,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {Align, Marker} from 'react-native-nmap';
import {Property, PropertyType} from '../../db/db';

const ItemMarker = ({
  item,
  onPress,
  type,
}: {
  item: Property<typeof type>;
  onPress: (item: Property<typeof type>, type: PropertyType) => void;
  type: PropertyType;
}) => {
  return (
    <TouchableWithoutFeedback onPress={() => onPress(item, type)}>
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
              {'area' in item
                ? Math.round(item.dealAmount / 1000) / 10
                : item.dealAmount}
              억
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
            text: `${
              'area' in item
                ? Math.round(item.dealAmount / 1000) / 10
                : item.dealAmount
            }억`,
            color: 'white',
            haloColor: 'transparent',
          }}
        />
      )}
    </TouchableWithoutFeedback>
  );
};

export default ItemMarker;
