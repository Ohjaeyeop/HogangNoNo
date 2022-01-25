import React, {useEffect} from 'react';
import {propertyApi} from '../apis/PropertyApi';
import {SafeAreaView, Text} from 'react-native';

const Home = () => {
  useEffect(() => {
    propertyApi();
  }, []);

  return (
    <SafeAreaView>
      <Text>sdf</Text>
    </SafeAreaView>
  );
};

export default Home;
