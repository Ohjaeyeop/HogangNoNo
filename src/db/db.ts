import SQLite from 'react-native-sqlite-storage';
import {propertyApi} from '../apis/PropertyApi';
import {dong, gu, regionCodes} from '../data/regionInfos';
import {addrToCoord} from '../apis/GeocodeApi';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase;

export const init = async () => {
  db = await SQLite.openDatabase(
    {
      name: 'propertyDB.db',
      location: 'default',
    },
    () => {},
    error => {
      console.log(error.message);
    },
  );
  /* await dropTable(db);
  await createTable(db);
  await insertAddressData(db);*/
  //await insertPropertyData(db).catch(err => console.log(err.message));
};

// eslint-disable-next-line @typescript-eslint/no-shadow
const dropTable = async (db: SQLite.SQLiteDatabase) => {
  await db.executeSql('Drop TABLE Gu');
  await db.executeSql('Drop TABLE Dong');
  await db.executeSql('Drop TABLE Apartment');
  await db.executeSql('Drop TABLE Deal');
};

// eslint-disable-next-line @typescript-eslint/no-shadow
const createTable = async (db: SQLite.SQLiteDatabase) => {
  await db.executeSql(
    'CREATE TABLE "Gu" ( "name" TEXT, "dealAmount" NUMERIC DEFAULT 0, "latitude" NUMERIC, "longitude" NUMERIC, "count" INTEGER DEFAULT 0, PRIMARY KEY("name") )',
  );
  await db.executeSql(
    'CREATE TABLE "Dong" ("name" TEXT, "gu" TEXT, "dealAmount" NUMERIC DEFAULT 0, "latitude" NUMERIC, "longitude" NUMERIC, "count" INTEGER DEFAULT 0, FOREIGN KEY("gu") REFERENCES "Gu"("name"), PRIMARY KEY("name") )',
  );
  await db.executeSql(
    'CREATE TABLE "Apartment" ( "name" TEXT UNIQUE, "dong" TEXT, "latitude" NUMERIC, "longitude" NUMERIC, "buildYear" INTEGER, "area" NUMERIC, "dealAmount" NUMERIC DEFAULT 0, "count" INTEGER DEFAULT 0, FOREIGN KEY("dong") REFERENCES "Dong"("name"), PRIMARY KEY("name") )',
  );
  await db.executeSql(
    'CREATE TABLE "Deal" ( "id" INTEGER UNIQUE, "year" INTEGER, "month" INTEGER, "day" INTEGER, "dealAmount" INTEGER, "area" NUMERIC, "apartmentName" TEXT, FOREIGN KEY("apartmentName") REFERENCES "Apartment"("name"), PRIMARY KEY("id" AUTOINCREMENT) )',
  );
};

// 구, 동 정보 삽입
// eslint-disable-next-line @typescript-eslint/no-shadow
const insertAddressData = async (db: SQLite.SQLiteDatabase) => {
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
          `INSERT INTO Dong(name, gu, latitude, longitude) values ('${value}', '${arr[0]}', ${y}, ${x})`,
        )
        .catch(err => console.log(err.message, arr[1]));
    }
  }
};

const getDate = () => {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;

  let date = year * 100 + month;
  let ymd =
    (year - 3 + Math.floor(month / 11)) * 100 +
    (month + 1 === 13 ? 1 : month + 1);
  return {date, ymd};
};

// 거래정보 삽입
// eslint-disable-next-line @typescript-eslint/no-shadow
const insertPropertyData = async (db: SQLite.SQLiteDatabase) => {
  let {date, ymd} = getDate();

  while (ymd <= date) {
    for (const code in regionCodes) {
      await propertyApi(code, ymd.toString()).then(async items => {
        for (const item of items) {
          await db
            .executeSql(
              `INSERT OR IGNORE INTO Apartment(name, dong, latitude, longitude, buildYear) values ("${
                item.dong + ' ' + item.apartmentName
              }", '${
                regionCodes[item.code].split(' ')[1] + ' ' + item.dong
              }', ${item.latitude}, ${item.longitude}, '${item.buildYear}')`,
            )
            .catch(err => console.log(err.message, item.apartmentName));

          await db
            .executeSql(
              `INSERT OR IGNORE INTO Deal(year, month, day, dealAmount, area, apartmentName) values (${
                item.dealYear
              }, ${item.dealMonth}, ${item.dealDate}, ${item.dealAmount}, ${
                item.area
              }, "${item.dong + ' ' + item.apartmentName}")`,
            )
            .catch(err => console.log(err.message));
        }
      });
    }
    ymd =
      (ymd + 1) % 100 === 13 ? (Math.floor(ymd / 100) + 1) * 100 + 1 : ymd + 1;
  }
};

export const selectAll = async () => {
  const apartments = await db.executeSql('SELECT * FROM Apartment');
  const deals = await db.executeSql('SELECT * FROM Deal');
  console.log(apartments[0].rows.length);
  console.log(deals[0].rows.item(30000));
};

const selectData = async (
  {startX, startY, endX, endY}: CoordType,
  table: 'Apartment' | 'Dong' | 'Gu',
) => {
  const res = await db
    .executeSql(
      `SELECT * FROM ${table} WHERE latitude >= ${startX} and latitude <= ${endX} and longitude >= ${startY} and longitude <= ${endY} `,
    )
    .catch(err => console.log(err.message));
  let items = [];
  if (res) {
    for (let i = 0; i < res[0].rows.length; i++) {
      items.push(res[0].rows.item(i));
    }
  }
  return items;
};

export const getData = async (
  {startX, startY, endX, endY}: CoordType,
  zoom: number,
) => {
  if (zoom >= 14) {
    // 아파트 정보
    return await selectData({startX, startY, endX, endY}, 'Apartment');
  } else if (zoom >= 12) {
    // 동 정보
    return await selectData({startX, startY, endX, endY}, 'Dong');
  } else if (zoom >= 9) {
    // 구 정보
    return await selectData({startX, startY, endX, endY}, 'Gu');
  } else {
    // 시 정보
  }
};

type CoordType = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type GuType = {
  name: string;
  dealAmount: number;
  count: number;
  latitude: number;
  longitude: number;
};

export type DongType = {
  name: string;
  gu: string;
  dealAmount: number;
  count: number;
  latitude: number;
  longitude: number;
};

export type ApartmentType = {
  name: string;
  dong: string;
  latitude: number;
  longitude: number;
  buildYear: number;
  area: number;
  dealAmount: number;
  count: 0;
};

export type DealType = {
  id: number;
  year: number;
  month: number;
  day: number;
  dealAmount: number;
  area: number;
  apartmentName: string;
};
