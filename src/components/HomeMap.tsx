import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Location = {
  latitude: number;
  longitude: number;
};
const statusBarHeight =
  Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

const HomeMap = () => {
  const [location, setLocation] = useState<Location>({
    latitude: 37.51721372684746,
    longitude: 127.05220125548395,
  });

  async function requestPermission() {
    try {
      if (Platform.OS === 'ios') {
        return await Geolocation.requestAuthorization('always');
      }
      if (Platform.OS === 'android') {
        return await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    requestPermission().then(result => {
      if (result === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setLocation({
              latitude,
              longitude,
            });
          },
          error => {
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
        );
      }
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <View style={styles.statusBar} />
      <View style={styles.header}>
        <Icon name={'home-filled'} size={20} style={{color: 'white'}} />
      </View>
      <NaverMapView
        style={{width: '100%', height: '90%'}}
        center={{...location, zoom: 16}}
        zoomControl={false}>
        <Marker coordinate={location} />
      </NaverMapView>
      <Icon name={'my-location'} size={20} style={styles.myLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: statusBarHeight,
    backgroundColor: '#835eeb',
  },
  header: {
    backgroundColor: '#835eeb',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myLocation: {
    position: 'absolute',
    right: 10,
    top: statusBarHeight + 50,
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 4,
  },
});

export default HomeMap;
