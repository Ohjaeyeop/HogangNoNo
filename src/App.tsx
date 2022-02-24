import 'react-native-gesture-handler';
import React from 'react';
import Home from './components/Home';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Detail from './components/Detail';
import {Linking} from 'react-native';
import {dong} from './data/regionInfos';

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
        Detail: {
          path: 'detail/:name/:dealAmount/:buildYear/:area',
          parse: {
            name: (name: string) => {
              const decodedName = decodeURI(name);
              for (let i = 0; i < dong.length; i++) {
                if (decodedName.indexOf(dong[i].split(' ')[1]) === 0) {
                  return (
                    decodedName.slice(0, dong[i].split(' ')[1].length) +
                    ' ' +
                    decodedName.slice(dong[i].split(' ')[1].length)
                  );
                }
              }
            },
            dealAmount: Number,
            buildYear: Number,
            area: Number,
          },
        },
      },
    },
    async getInitialURL() {
      return await Linking.getInitialURL();
    },
    subscribe(listener: any) {
      const onReceiveURL = ({url}: {url: string}) => listener(url);
      const subscriber = Linking.addEventListener('url', onReceiveURL);
      return () => {
        subscriber.remove();
      };
    },
  };

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
