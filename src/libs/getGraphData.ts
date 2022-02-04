import {getDate} from '../db/db';
import {ResultSetRowList} from 'react-native-sqlite-storage';

export type DealInfoGroupType = {
  amount: number;
  count: number;
  month: number;
  year: number;
};

export const getGraphData = (dealInfoGroup: ResultSetRowList) => {
  let index = 0;
  let {date, ymd} = getDate();
  const arr: DealInfoGroupType[] = [];
  ymd = 201902;
  while (ymd <= date) {
    if (
      index < dealInfoGroup.length &&
      ymd ===
        dealInfoGroup.item(index).year * 100 + dealInfoGroup.item(index).month
    ) {
      arr.push({
        amount: dealInfoGroup.item(index).avg,
        count: dealInfoGroup.item(index).count,
        month: dealInfoGroup.item(index).month,
        year: dealInfoGroup.item(index).year,
      });
      index++;
    } else {
      arr.push({
        amount: 0,
        count: 0,
        month: ymd % 100,
        year: Math.floor(ymd / 100),
      });
    }
    ymd =
      (ymd + 1) % 100 === 13 ? (Math.floor(ymd / 100) + 1) * 100 + 1 : ymd + 1;
  }

  return arr;
};
