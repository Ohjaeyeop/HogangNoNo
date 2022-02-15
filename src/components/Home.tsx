import React, {useRef, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from './map/MapView';
import {Coord} from 'react-native-nmap';
import {color} from '../theme/color';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const AnimatableTouchableOpacity =
  Animatable.createAnimatableComponent(TouchableOpacity);

const Home = () => {
  const safeArea = useSafeAreaInsets();
  const [location, setLocation] = useState<Coord>({
    latitude: 37.50882651313064,
    longitude: 127.06310347509722,
  });
  const [visible, setVisible] = useState(true);
  const headerRef = useRef<Animatable.View & View>(null);
  const myLocationRef = useRef<
    typeof AnimatableTouchableOpacity & TouchableOpacity
  >(null);

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
      throw err;
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

  const handlePress = () => {
    if (visible) {
      headerRef.current?.fadeOutUp?.(500);
      myLocationRef.current?.fadeOutRight?.(500);
    } else {
      headerRef.current?.fadeInDown?.(500);
      myLocationRef.current?.fadeInRight?.(500);
    }
    setVisible(!visible);
  };

  return (
    <View style={{flex: 1}}>
      {Platform.OS === 'ios' && (
        <View style={{height: safeArea.top, backgroundColor: color.main}} />
      )}
      <MapView location={location} handlePress={handlePress} />
      <Animatable.View
        style={[{top: safeArea.top}, styles.header]}
        ref={headerRef}>
        <Icon name={'home-filled'} size={20} style={{color: 'white'}} />
      </Animatable.View>
      <AnimatableTouchableOpacity
        style={[{top: safeArea.top + 60}, styles.myLocation]}
        onPress={() => getMyLocation()}
        ref={myLocationRef}>
        <Icon name={'my-location'} size={18} style={styles.locationIcon} />
      </AnimatableTouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    backgroundColor: color.main,
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    color: color.main,
  },
  myLocation: {
    position: 'absolute',
    right: 15,
    width: 32,
    height: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: 'gray',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

export default Home;
