import React from 'react';
import {ImageBackground, Platform, Text} from 'react-native';
import {Align, Marker} from 'react-native-nmap';
import {ItemType} from '../apis/PropertyApi';

const ItemMarker = ({item}: {item: ItemType}) => {
  return (
    <>
      {Platform.OS === 'android' ? (
        <Marker
          coordinate={{latitude: item.latitude, longitude: item.longitude}}
          width={64}
          height={54}>
          <ImageBackground
            source={require('../assets/images/marker.png')}
            resizeMode="stretch"
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#9aa7b8', fontSize: 12}}>{item.area}평</Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {item.dealAmount}억
            </Text>
          </ImageBackground>
        </Marker>
      ) : (
        <Marker
          image={require('../assets/images/marker.png')}
          coordinate={{
            latitude: item.latitude,
            longitude: item.longitude,
          }}
          width={64}
          height={54}
          caption={{
            text: `${item.area}평`,
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
