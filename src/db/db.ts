import SQLite from 'react-native-sqlite-storage';
import {propertyApi, leasePropertyApi} from '../apis/PropertyApi';
import {dong, gu, regionCodes} from '../data/regionInfos';
import {addrToCoord} from '../apis/GeocodeApi';
import firestore from '@react-native-firebase/firestore';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase;

export const init = async () => {
  db = await SQLite.openDatabase(
    {
      name: 'propertyDB.db',
      location: 'default',
      createFromLocation: '~www/propertyDB.db',
    },
    () => {},
    error => {
      console.log(error.message);
    },
  );

  /*  const isTable: number = await db
    .executeSql("SELECT COUNT(*) as c FROM sqlite_master where name='Lease'")
    .then(res => res[0].rows.item(0).c);
  if (!isTable) {
    await createTable(db);
    await insertAddressData(db);
    await insertPropertyData(db);
    await updateApartment();
    await updateDong();
    await updateGu();
    await insertLeasePropertyData(db);
  }*/
};

const dropTable = async (db: SQLite.SQLiteDatabase) => {
  await db.executeSql('Drop TABLE Gu');
  await db.executeSql('Drop TABLE Dong');
  await db.executeSql('Drop TABLE Apartment');
  await db.executeSql('Drop TABLE Deal');
};

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
  await db
    .executeSql(
      'CREATE TABLE "Lease" ( "id" INTEGER UNIQUE, "year" INTEGER, "month" INTEGER, "day" INTEGER, "dealAmount" INTEGER, "monthlyRent" INTEGER, "area" NUMERIC, "apartmentName" TEXT, "floor" INTEGER, PRIMARY KEY("id" AUTOINCREMENT) )',
    )
    .catch(err => console.log(err.message));
};

// 구, 동 정보 삽입
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
    if (gu.includes(arr[0])) {
      const res = await addrToCoord(`서울특별시 ${value}`);
      if (res) {
        const {x, y} = res;
        await db
          .executeSql(
            `INSERT INTO Dong(name, gu, latitude, longitude) values ('${value}', '${arr[0]}', ${y}, ${x})`,
          )
          .catch(err => console.log(err.message));
      }
    }
  }
};

export const getDate = () => {
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
const insertPropertyData = async (db: SQLite.SQLiteDatabase) => {
  let {date, ymd} = getDate();
  ymd = 201902;
  date = 202202;
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
};

const insertLeasePropertyData = async (db: SQLite.SQLiteDatabase) => {
  let {date, ymd} = getDate();
  ymd = 201902;
  date = 202202;
  while (ymd <= date) {
    // console.log(ymd);
    for (const code in regionCodes) {
      await leasePropertyApi(code, ymd.toString())
        .then(async items => {
          for (const item of items) {
            await db
              .executeSql(
                `INSERT OR IGNORE INTO Lease(apartmentName, year, month, day, dealAmount, monthlyRent, floor, area) values ("${
                  item.dong + ' ' + item.apartmentName
                }", ${item.dealYear}, ${item.dealMonth}, ${item.dealDate}, ${
                  item.deposit
                }, ${item.monthlyRent}, ${item.floor}, ${item.area})`,
              )
              .catch(err => console.log(err.message));
          }
        })
        .catch(err => console.log(err.message));
    }
    ymd =
      (ymd + 1) % 100 === 13 ? (Math.floor(ymd / 100) + 1) * 100 + 1 : ymd + 1;
  }
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
    const dealAmount = await getRecentDealAmount('Deal', name, area);

    await db.executeSql(
      `UPDATE Apartment SET area = ${area}, dealAmount=${dealAmount} WHERE name="${name}"`,
    );
  }
};

const updateDong = async () => {
  const items = await db
    .executeSql(
      `SELECT avg(dealAmount) as dealAmount, dong FROM Apartment group by dong`,
    )
    .then(res => res[0].rows);

  for (let i = 0; i < items.length; i++) {
    const {dealAmount, dong} = items.item(i);

    await db.executeSql(
      `UPDATE Dong SET dealAmount = ${
        Math.round(dealAmount / 1000) / 10
      } WHERE name = "${dong}"`,
    );
  }
};

const updateGu = async () => {
  const items = await db
    .executeSql(
      `SELECT avg(dealAmount) as dealAmount, gu FROM Dong group by gu`,
    )
    .then(res => res[0].rows);

  for (let i = 0; i < items.length; i++) {
    const {dealAmount, gu} = items.item(i);
    await db.executeSql(
      `UPDATE Gu SET dealAmount = ${
        Math.round(dealAmount * 10) / 10
      } WHERE name = "${gu}"`,
    );
  }
};

const selectData = async (
  {startX, startY, endX, endY}: CoordType,
  table: PropertyType,
) => {
  let items: Property<typeof table>[] = [];
  await firestore()
    .collection(table)
    .where('latitude', '>=', startX)
    .where('latitude', '<=', endX)
    .get()
    .then(querySnapshot =>
      querySnapshot.docs.map(doc =>
        items.push(doc.data() as Property<typeof table>),
      ),
    );
  return items.filter(
    item => item.longitude >= startY && item.longitude <= endY,
  );
};

const zoomScale = {
  gu: 9,
  dong: 12,
  apartment: 14,
};
export const getDisplayedData = async (
  {startX, startY, endX, endY}: CoordType,
  zoom: number,
) => {
  return await selectData(
    {startX, startY, endX, endY},
    getPropertyTypeByZoom(zoom),
  );
};

export const getDealInfo = async (
  table: 'Deal' | 'Lease',
  apartmentName: string,
  area: number,
) => {
  let dealInfoList: Deal<typeof table>[] = [];
  let dealInfoGroup: GroupByDate[] = [];

  await firestore()
    .collection(table)
    .where('apartmentName', '==', apartmentName)
    .where('area', '==', area)
    .orderBy('year', 'desc')
    .orderBy('month', 'desc')
    .orderBy('day', 'desc')
    .get()
    .then(querySnapshot =>
      querySnapshot.docs.map(doc =>
        dealInfoList.push({
          year: doc.data().year,
          month: doc.data().month,
          day: doc.data().day,
          dealAmount: doc.data().dealAmount,
          area: doc.data().area,
          apartmentName: doc.data().apartmentName,
          floor: doc.data().floor,
          monthlyRent: doc.data().monthlyRent && doc.data().monthlyRent,
        }),
      ),
    );

  dealInfoList.forEach(dealInfo => {
    let flag = false;
    for (let i = 0; i < dealInfoGroup.length; i++) {
      if (
        dealInfoGroup[i].month === dealInfo.month &&
        dealInfoGroup[i].year === dealInfo.year
      ) {
        dealInfoGroup[i].avg =
          (dealInfoGroup[i].avg * dealInfoGroup[i].count +
            dealInfo.dealAmount) /
          (dealInfoGroup[i].count + 1);
        dealInfoGroup[i].count++;
        flag = true;
        break;
      }
    }

    if (!flag) {
      dealInfoGroup.push({
        month: dealInfo.month,
        year: dealInfo.year,
        count: 1,
        avg: dealInfo.dealAmount,
      });
    }
  });

  return {dealInfoList, dealInfoGroup};
};

export const getRecentDealAmount = async (
  table: 'Deal' | 'Lease',
  name: string,
  area: number,
) => {
  let count = 0;
  let sum = 0;

  await firestore()
    .collection(table)
    .where('apartmentName', '==', name)
    .where('area', '==', area)
    .orderBy('year', 'desc')
    .orderBy('month', 'desc')
    .get()
    .then(querySnapshot => {
      const {year, month} = querySnapshot.docs[0].data();
      for (let i = 0; i < querySnapshot.docs.length; i++) {
        if (
          querySnapshot.docs[i].data().year === year &&
          querySnapshot.docs[i].data().month === month
        ) {
          count++;
          sum += querySnapshot.docs[i].data().dealAmount;
        } else {
          break;
        }
      }
    });

  return Math.round((sum / count) * 10) / 10;
};

export const getAreaList = async (apartmentName: string) => {
  let area: number[] = [];
  await firestore()
    .collection('Deal')
    .where('apartmentName', '==', apartmentName)
    .orderBy('area', 'asc')
    .get()
    .then(querySnapshot => {
      querySnapshot.docs.map(
        doc => !area.includes(doc.data().area) && area.push(doc.data().area),
      );
    });

  return area;
};

type CoordType = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type PropertyType = 'Gu' | 'Dong' | 'Apartment';

export type Property<T extends PropertyType> = {
  name: string;
  dealAmount: number;
  latitude: number;
  longitude: number;

  gu: T extends 'Gu' ? string : never;
  dong: T extends 'Apartment' ? string : never;
  buildYear: T extends 'Apartment' ? number : never;
  area: T extends 'Apartment' ? number : never;
};

export type Deal<T extends 'Deal' | 'Lease'> = {
  year: number;
  month: number;
  day: number;
  dealAmount: number;
  area: number;
  apartmentName: string;
  floor: number;
  monthlyRent: T extends 'Lease' ? number : never;
};

export type GroupByDate = {
  month: number;
  year: number;
  count: number;
  avg: number;
};

export const getPropertyTypeByZoom = (zoom: number): PropertyType => {
  return zoom >= zoomScale.apartment
    ? 'Apartment'
    : zoom >= zoomScale.dong
    ? 'Dong'
    : 'Gu';
};
