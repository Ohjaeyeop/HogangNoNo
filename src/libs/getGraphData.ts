import {getDate} from '../db/db';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import {displayedAmount} from './displayedAmount';

export type DealInfoGroupType = {
  amount: number;
  count: number;
  month: number;
  year: number;
  displayedAmount: string;
};

export const getGraphData = (dealInfoGroup: ResultSetRowList) => {
  let i = 0;
  let j = 0;
  let {date, ymd} = getDate();
  const arr: DealInfoGroupType[] = [];
  ymd = 201902;

  while (ymd <= date) {
    if (
      j < dealInfoGroup.length &&
      ymd === dealInfoGroup.item(j).year * 100 + dealInfoGroup.item(j).month
    ) {
      arr.push({
        amount: Math.floor(dealInfoGroup.item(j).avg),
        count: dealInfoGroup.item(j).count,
        month: dealInfoGroup.item(j).month,
        year: dealInfoGroup.item(j).year,
        displayedAmount: displayedAmount(dealInfoGroup.item(j).avg),
      });
      j++;
    } else {
      arr.push({
        amount: i > 0 ? arr[i - 1].amount : 0,
        count: 0,
        month: ymd % 100,
        year: Math.floor(ymd / 100),
        displayedAmount: i > 0 ? arr[i - 1].displayedAmount : '0원',
      });
    }
    i++;
    ymd =
      (ymd + 1) % 100 === 13 ? (Math.floor(ymd / 100) + 1) * 100 + 1 : ymd + 1;
  }

  return arr;
};
