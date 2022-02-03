import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import Svg, {Path} from 'react-native-svg';

const DealInfoGraph = ({dealInfoGroup}: {dealInfoGroup: ResultSetRowList}) => {
  [...new Array(dealInfoGroup.length).keys()].map(index =>
    console.log(dealInfoGroup.item(index)),
  );

  return (
    <View style={styles.graphContainer}>
      <Svg height="150" width="100%">
        <Path d="M0 150 L351 0" fill="none" stroke="#835eeb" strokeWidth={3} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  graphContainer: {
    marginVertical: 20,
  },
});

export default DealInfoGraph;
