import SQLite from 'react-native-sqlite-storage';
import {propertyApi} from '../apis/PropertyApi';

SQLite.enablePromise(true);

let db;

export const init = () => {
  db = SQLite.openDatabase(
    {
      name: 'propertyDB.db',
      location: 'default',
    },
    () => {
      console.log('DB connected');
    },
    error => {
      console.log(error.message);
    },
  );
};
