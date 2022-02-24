import {getDate, GroupByDate} from '../db/db';
import {displayedAmount} from './displayedAmount';

export type DealInfoGroupType = {
  amount: number;
  count: number;
  month: number;
  year: number;
  displayedAmount: string;
};

export const getGraphData = (dealInfoGroup: GroupByDate[]) => {
  let i = 0;
  let j = 0;
  let {date, ymd} = getDate();
  const arr: DealInfoGroupType[] = [];
  ymd = 201902;
  date = 202202;

  while (ymd <= date) {
    if (
      j < dealInfoGroup.length &&
      ymd === dealInfoGroup[j].year * 100 + dealInfoGroup[j].month
    ) {
      arr.push({
        amount: Math.floor(dealInfoGroup[j].avg),
        count: dealInfoGroup[j].count,
        month: dealInfoGroup[j].month,
        year: dealInfoGroup[j].year,
        displayedAmount: (
          displayedAmount(dealInfoGroup[j].avg).hundredMillion +
          ' ' +
          displayedAmount(dealInfoGroup[j].avg).tenMillion
        ).trim(),
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
