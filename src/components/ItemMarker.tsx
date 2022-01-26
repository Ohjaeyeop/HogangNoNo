import React from 'react';
import {Image, Platform, Text, View} from 'react-native';
import {Marker} from 'react-native-nmap';

const ItemMarker = ({item}) => {
  return (
    <Marker
      coordinate={{
        latitude: item.latitude,
        longitude: item.longitude,
      }}
      width={64}
      height={54}>
      {Platform.OS === 'android' && (
        <>
          <Image
            source={{
              uri: 'https://raw.githubusercontent.com/yijunmin0/TuringNoNo/%ED%99%88%ED%99%94%EB%A9%B4%EA%B0%9C%EB%B0%9C/src/assets/images/marker.png',
            }}
            style={{
              width: 64,
              height: 54,
              resizeMode: 'stretch',
              position: 'absolute',
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 5,
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#9AA7B8', fontSize: 12}}>{item.area}평</Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {parseInt(item.dealAmount) / 10}억
            </Text>
          </View>
        </>
      )}
    </Marker>
  );
};

export default ItemMarker;
