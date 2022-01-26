import AsyncStorage from '@react-native-async-storage/async-storage';
import {addrToCoord} from '../apis/GeocodeApi';

export const getCoord = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    } else {
      const res = await addrToCoord(key);
      if (res) {
        const {x, y} = res;
        await AsyncStorage.setItem(key, JSON.stringify({x, y}));
        return {x, y};
      }
      return undefined;
    }
  } catch (err) {
    console.log(err);
  }
};
