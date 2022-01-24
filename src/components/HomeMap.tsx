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

type Location = {
  latitude: number;
  longitude: number;
};
const statusBarHeight =
  Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

const HomeMap = () => {
  const [location, setLocation] = useState<Location | undefined>(undefined);

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
        <Text>HogangNoNo</Text>
      </View>
      {location ? (
        <NaverMapView
          style={{width: '100%', height: '90%'}}
          center={{...location, zoom: 16}}
          zoomControl={false}>
          <Marker coordinate={location} />
        </NaverMapView>
      ) : (
        <Text>Loading..</Text>
      )}
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
});

export default HomeMap;
