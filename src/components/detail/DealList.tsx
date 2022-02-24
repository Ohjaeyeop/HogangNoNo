import React from 'react';
import {displayedAmount} from '../../libs/displayedAmount';
import Table from '../../share/Table';
import {Deal} from '../../db/db';

const DealList = ({dealInfoList}: {dealInfoList: Deal<'Deal' | 'Lease'>[]}) => {
  const columnNames = ['계약일', '가격', '층'];
  const boldColumns = [1];
  const tableData = dealInfoList.map(dealInfo => {
    const {year, month, day, dealAmount, monthlyRent, floor} = dealInfo;
    const dealDate = `${year}.${month < 10 ? `0${month}` : month}.${
      day < 10 ? `0${day}` : day
    }`;
    const {hundredMillion, tenMillion} = displayedAmount(dealAmount);
    const amount =
      `${hundredMillion} ${tenMillion}`.trim() +
      `${monthlyRent > 0 ? `/${monthlyRent}` : ''}`;
    return [dealDate, amount, `${floor}층`];
  });

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
