import React, {useEffect} from 'react';
import {propertyApi} from '../apis/PropertyApi';
import {SafeAreaView, Text} from 'react-native';

const Home = () => {
  useEffect(() => {
    propertyApi().then(items => console.log(items));
  }, []);

  return (
    <SafeAreaView>
      <Text>sdf</Text>
    </SafeAreaView>
  );
};

export default Home;
