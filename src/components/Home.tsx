import React, {useState} from 'react';
import {PermissionsAndroid, Platform, StyleSheet, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from './map/MapView';
import {Coord} from 'react-native-nmap';

const statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;

const Home = () => {
  const [location, setLocation] = useState<Coord | undefined>();

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
    } catch (err) {
      console.log(err);
    }
  }

  function getMyLocation() {
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
  }

  return (
    <View style={{flex: 1}}>
      {Platform.OS === 'ios' && <View style={styles.statusBar} />}
      <View style={styles.header}>
        <Icon name={'home-filled'} size={20} style={{color: 'white'}} />
      </View>
      <MapView location={location} />
      <Icon
        name={'my-location'}
        size={20}
        style={styles.myLocation}
        onPress={() => getMyLocation()}
      />
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
    right: 15,
    top: statusBarHeight + 60,
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 4,
  },
});

export default Home;
