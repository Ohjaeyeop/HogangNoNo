import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import NaverMapView from 'react-native-nmap';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const statusBarHeight =
  Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

const HomeMap = () => {
  return (
    <View style={{flex: 1}}>
      <View style={styles.statusBar} />
      <View style={styles.header}>
        <Text>HogangNoNo</Text>
      </View>
      <NaverMapView
        style={{width: '100%', height: '90%'}}
        zoomControl={false}></NaverMapView>
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
