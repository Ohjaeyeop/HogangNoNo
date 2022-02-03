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
  //await dropTable(db);
  /* await createTable(db);
  await insertAddressData(db);*/
  /*await insertPropertyData(db).catch(err => console.log(err.message));
  await updateApartment();
  await updateDong();
  await updateGu();*/
};

// eslint-disable-next-line @typescript-eslint/no-shadow
const dropTable = async (db: SQLite.SQLiteDatabase) => {
  await db.executeSql('Drop TABLE Gu');
  await db.executeSql('Drop TABLE Dong');
  await db.executeSql('Drop TABLE Apartment');
  await db.executeSql('Drop TABLE Deal');
  console.log(1);
};

// eslint-disable-next-line @typescript-eslint/no-shadow
const createTable = async (db: SQLite.SQLiteDatabase) => {
  await db.executeSql(
    'CREATE TABLE "Gu" ( "name" TEXT, "dealAmount" NUMERIC DEFAULT 0, "latitude" NUMERIC, "longitude" NUMERIC, PRIMARY KEY("name") )',
  );
  await db.executeSql(
    'CREATE TABLE "Dong" ("name" TEXT, "gu" TEXT, "dealAmount" NUMERIC DEFAULT 0, "latitude" NUMERIC, "longitude" NUMERIC, FOREIGN KEY("gu") REFERENCES "Gu"("name"), PRIMARY KEY("name") )',
  );
  await db.executeSql(
    'CREATE TABLE "Apartment" ( "name" TEXT UNIQUE, "dong" TEXT, "latitude" NUMERIC, "longitude" NUMERIC, "buildYear" INTEGER, "area" NUMERIC, "dealAmount" NUMERIC DEFAULT 0, FOREIGN KEY("dong") REFERENCES "Dong"("name"), PRIMARY KEY("name") )',
  );
  await db.executeSql(
    'CREATE TABLE "Deal" ( "id" INTEGER UNIQUE, "year" INTEGER, "month" INTEGER, "day" INTEGER, "dealAmount" INTEGER, "area" NUMERIC, "apartmentName" TEXT, "floor" INTEGER, FOREIGN KEY("apartmentName") REFERENCES "Apartment"("name"), PRIMARY KEY("id" AUTOINCREMENT) )',
  );
  console.log(2);
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
  console.log(3);
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
  ymd = 202105;
  while (ymd <= date) {
    console.log(ymd, date);
    for (const code in regionCodes) {
      console.log(code);
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
              `INSERT OR IGNORE INTO Deal(year, month, day, dealAmount, area, apartmentName, floor) values (${
                item.dealYear
              }, ${item.dealMonth}, ${item.dealDate}, ${item.dealAmount}, ${
                item.area
              }, "${item.dong + ' ' + item.apartmentName}", ${item.floor})`,
            )
            .catch(err => console.log(err.message));
        }
      });
    }
    ymd =
      (ymd + 1) % 100 === 13 ? (Math.floor(ymd / 100) + 1) * 100 + 1 : ymd + 1;
  }
  console.log(4);
};

export const getRecentDealAmount = async (name: string, area: number) => {
  return await db
    .executeSql(
      `SELECT avg(dealAmount) as dealAmount FROM DEAL WHERE apartmentName = "${name}" and area = ${area} group by year, month order by year desc, month desc`,
    )
    .then(res => Math.round(res[0].rows.item(0).dealAmount * 10) / 10);
};

const updateApartment = async () => {
  const groupByApartAndArea =
    'SELECT * FROM (SELECT apartmentName, area, count(*) as count FROM DEAL group by apartmentName, area )';
  const apartments = await db
    .executeSql(`SELECT name FROM Apartment`)
    .then(res => res[0].rows);

  for (let i = 0; i < apartments.length; i++) {
    const {name} = apartments.item(i);
    const maxCount = await db.executeSql(
      `SELECT max(count) as count FROM (${groupByApartAndArea}) WHERE apartmentName = "${name}"`,
    );
    const area = await db
      .executeSql(
        `SELECT area FROM (${groupByApartAndArea}) WHERE apartmentName = "${name}" and count = ${
          maxCount[0].rows.item(0).count
        }`,
      )
      .then(res => res[0].rows.item(0).area);
    const dealAmount = getRecentDealAmount(name, area);

    await db.executeSql(
      `UPDATE Apartment SET area = ${area}, dealAmount=${dealAmount} WHERE name="${name}"`,
    );
  }
  console.log(5);
};

const updateDong = async () => {
  const items = await db
    .executeSql(
      `SELECT avg(dealAmount) as dealAmount, dong FROM Apartment group by dong`,
    )
    .then(res => res[0].rows);

  for (let i = 0; i < items.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const {dealAmount, dong} = items.item(i);

    await db.executeSql(
      `UPDATE Dong SET dealAmount = ${
        Math.round(dealAmount / 1000) / 10
      } WHERE name = "${dong}"`,
    );
  }
  console.log(6);
};

const updateGu = async () => {
  const items = await db
    .executeSql(
      `SELECT avg(dealAmount) as dealAmount, gu FROM Dong group by gu`,
    )
    .then(res => res[0].rows);

  for (let i = 0; i < items.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const {dealAmount, gu} = items.item(i);
    await db.executeSql(
      `UPDATE Gu SET dealAmount = ${
        Math.round(dealAmount * 10) / 10
      } WHERE name = "${gu}"`,
    );
  }
  console.log(7);
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

export const getDealInfo = async (apartmentName: string, area: number) => {
  const selectQuery = `SELECT * FROM Deal WHERE apartmentName="${apartmentName}" and area=${area} order by year desc, month desc, day desc`;
  const dealInfoList = await db
    .executeSql(selectQuery)
    .then(res => res[0].rows);
  const dealInfoGroup = await db
    .executeSql(
      `SELECT count(*) as count, avg(dealAmount) as avg, year, month FROM (${selectQuery}) group by year, month`,
    )
    .then(res => res[0].rows);

  return {dealInfoList, dealInfoGroup};
};

export const getAreaList = async (apartmentName: string) => {
  return await db
    .executeSql(
      `SELECT DISTINCT area FROM Deal WHERE apartmentName="${apartmentName}" order by area asc`,
    )
    .then(res => res[0].rows);
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
  latitude: number;
  longitude: number;
};

export type DongType = {
  name: string;
  gu: string;
  dealAmount: number;
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
};

export type DealType = {
  id: number;
  year: number;
  month: number;
  day: number;
  dealAmount: number;
  area: number;
  apartmentName: string;
  floor: number;
};
