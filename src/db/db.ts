import SQLite from 'react-native-sqlite-storage';
import {propertyApi} from '../apis/PropertyApi';
import {dong, gu} from '../data/regionInfos';
import {addrToCoord} from '../apis/GeocodeApi';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase;

export const init = async () => {
  db = await SQLite.openDatabase(
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
  /*
  await dropTable(db);
  await createTable(db);
  await insertAddressData(db);*/
};

const dropTable = async db => {
  await db.executeSql('Drop TABLE Gu');
  await db.executeSql('Drop TABLE Dong');
  await db.executeSql('Drop TABLE Apartment');
  await db.executeSql('Drop TABLE Deal');
};

const createTable = async db => {
  await db.executeSql(
    'CREATE TABLE "Gu" ( "name" TEXT UNIQUE, "dealAmount" NUMERIC DEFAULT 0, "latitude" NUMERIC, "longitude" NUMERIC, "count" INTEGER DEFAULT 0, PRIMARY KEY("name") )',
  );
  await db.executeSql(
    'CREATE TABLE "Dong" ("name" TEXT, "gu" TEXT, "dealAmount" NUMERIC DEFAULT 0, "latitude" NUMERIC, "longitude" NUMERIC, "count" INTEGER DEFAULT 0, FOREIGN KEY("gu") REFERENCES "Gu"("name") )',
  );
  await db.executeSql(
    'CREATE TABLE "Apartment" ( "name" TEXT UNIQUE, "dong" TEXT, "latitude" NUMERIC, "longitude" NUMERIC, "buildYear" INTEGER, "area" NUMERIC, "dealAmount" NUMERIC, FOREIGN KEY("dong") REFERENCES "Dong"("name"), PRIMARY KEY("name") )',
  );
  await db.executeSql(
    'CREATE TABLE "Deal" ( "id" INTEGER UNIQUE, "year" INTEGER, "month" INTEGER, "day" INTEGER, "dealAmount" INTEGER, "area" NUMERIC, "apartmentName" TEXT, FOREIGN KEY("apartmentName") REFERENCES "Apartment"("name"), PRIMARY KEY("id" AUTOINCREMENT) )',
  );
};

const insertAddressData = async db => {
  for (const value of gu) {
    const res = await addrToCoord(`서울특별시 ${value}`);
    if (res) {
      const {x, y} = res;
      await db
        .executeSql(
          `INSERT INTO Gu(name, latitude, longitude) values ('${value}', ${y}, ${x})`,
        )
        .catch(err => console.log(err.message));
    }
  }

  for (const value of dong) {
    const arr = value.split(' ');
    const res = await addrToCoord(`서울특별시 ${value}`);
    if (res) {
      const {x, y} = res;
      await db
        .executeSql(
          `INSERT INTO Dong(name, gu, latitude, longitude) values ('${arr[1]}', '${arr[0]}', ${y}, ${x})`,
        )
        .catch(err => console.log(err.message, arr[1]));
    }
  }
};

export const insertDataToDeal = async () => {
  const res = await propertyApi('11000', '202201');
};

export const selectAll = async () => {
  const all = await db.executeSql('SELECT * FROM Gu');
  console.log(all[0].rows.item(0));
};
