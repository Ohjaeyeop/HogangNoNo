import React from 'react';
import {View} from 'react-native';
import {ResultSetRowList} from 'react-native-sqlite-storage';

const DealInfoGraph = ({
  dealInfoGroup,
}: {
  dealInfoGroup: ResultSetRowList | undefined;
}) => {
  if (!dealInfoGroup) {
    return null;
  }

  for (let i = 0; i < dealInfoGroup.length; i++) {
    console.log(dealInfoGroup.item(i));
  }

  return <View></View>;
};

export default DealInfoGraph;
