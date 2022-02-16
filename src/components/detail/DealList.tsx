import React from 'react';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import {displayedAmount} from '../../libs/displayedAmount';
import Table from '../../share/Table';

const DealList = ({dealInfoList}: {dealInfoList: ResultSetRowList}) => {
  const columnNames = ['계약일', '가격', '층'];
  const boldColumns = [1];
  const tableData = Array.from({length: dealInfoList.length}, (v, i) => i).map(
    index => {
      const {year, month, day, dealAmount, monthlyRent, floor} =
        dealInfoList.item(index);
      const dealDate = `${year}.${month < 10 ? `0${month}` : month}.${
        day < 10 ? `0${day}` : day
      }`;
      const {hundredMillion, tenMillion} = displayedAmount(dealAmount);
      const amount = `${hundredMillion} ${tenMillion}${
        monthlyRent > 0 ? `/${monthlyRent}` : ''
      }`;
      return [dealDate, amount, `${floor}층`];
    },
  );

  return (
    <Table
      columnNames={columnNames}
      tableData={tableData}
      boldColumns={boldColumns}
      flexes={[1, 1, 1]}
    />
  );
};

export default DealList;
