import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import Home from './components/Home';
import * as db from './db/db';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Detail from './components/Detail';
import {Linking} from 'react-native';

type StackParamList = {
  Home: undefined;
  Detail: {name: string; buildYear: number; area: number; dealAmount: number};
};

export type HomeProps = NativeStackScreenProps<StackParamList, 'Home'>;
export type DetailProps = NativeStackScreenProps<StackParamList, 'Detail'>;

const Stack = createNativeStackNavigator<StackParamList>();

const App = () => {
  const linking = {
    prefixes: ['hohoho://'],
    config: {
      screens: {
        Home: 'home',
        Detail: 'detail',
      },
    },
    async getInitialURL() {
      return await Linking.getInitialURL();
    },
    subscribe(listener: any) {
      const onReceiveURL = ({url}: {url: string}) => listener(url);
      Linking.addEventListener('url', onReceiveURL);

      return () => {
        Linking.removeEventListener('url', onReceiveURL);
      };
    },
  };

  useEffect(() => {
    db.init();
  }, []);
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Detail"
          component={Detail}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
