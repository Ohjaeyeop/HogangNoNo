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

  return <View></View>;
};

export default DealInfoGraph;
