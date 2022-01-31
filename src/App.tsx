import React, {useEffect} from 'react';
import Home from './components/Home';
import * as db from './db/db';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Detail from './components/Detail';

type StackParamList = {
  Home: undefined;
  Detail: undefined;
};

export type HomeProps = NativeStackScreenProps<StackParamList, 'Home'>;

const Stack = createNativeStackNavigator<StackParamList>();

const App = () => {
  useEffect(() => {
    db.init();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
