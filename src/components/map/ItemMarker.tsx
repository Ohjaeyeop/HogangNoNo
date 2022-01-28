import React from 'react';
import {ImageBackground, Platform, Text} from 'react-native';
import {Align, Marker} from 'react-native-nmap';
import {ApartmentType, DongType, GuType} from '../../db/db';

const ItemMarker = ({item}: {item: ApartmentType | DongType | GuType}) => {
  return (
    <>
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
              {'area' in item ? `${item.area}평` : `${item.name}`}
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
    </>
  );
};

export default ItemMarker;
