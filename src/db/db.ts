import firestore from '@react-native-firebase/firestore';

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
  let count = 0;
  let sum = 0;

  await firestore()
    .collection(table)
    .where('apartmentName', '==', apartmentName)
    .where('area', '==', area)
    .orderBy('year', 'desc')
    .orderBy('month', 'desc')
    .orderBy('day', 'desc')
    .get()
    .then(querySnapshot => {
      const {year, month} = querySnapshot.docs[0].data();
      querySnapshot.docs.map(doc => {
        dealInfoList.push({
          year: doc.data().year,
          month: doc.data().month,
          day: doc.data().day,
          dealAmount: doc.data().dealAmount,
          area: doc.data().area,
          apartmentName: doc.data().apartmentName,
          floor: doc.data().floor,
          monthlyRent: doc.data().monthlyRent && doc.data().monthlyRent,
        });
        if (doc.data().year === year && doc.data().month === month) {
          count++;
          sum += doc.data().dealAmount;
        }
      });
    })
    .catch(() => {
      return {
        dealInfoList: [],
        dealIngoGroup: [],
        recentDealAmount: 0,
      };
    });

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

  return {
    dealInfoList,
    dealInfoGroup,
    recentDealAmount: Math.round((sum / count) * 10) / 10,
  };
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
