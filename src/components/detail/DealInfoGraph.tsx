import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import Svg, {Path} from 'react-native-svg';
import {getGraphData} from '../../libs/getGraphData';
import {color} from '../../theme/color';

const graphWidth = Dimensions.get('window').width - 40 - 20;
const graphHeight = graphWidth * 0.4;

const DealInfoGraph = ({dealInfoGroup}: {dealInfoGroup: ResultSetRowList}) => {
  const arr = getGraphData(dealInfoGroup);
  const maxValue = Math.ceil(
    Math.max(...arr.map(value => value.amount)) / 10000,
  );
  const minValue = Math.floor(
    Math.min(...arr.map(value => value.amount).filter(value => value !== 0)) /
      10000,
  );
  const gap = graphWidth / 36;
  const diff = maxValue !== minValue ? maxValue - minValue : 1;
  let y = graphHeight;
  let x = 0;
  let prevX = 0;
  let path = `M0 ${y} `;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].amount !== 0) {
      y = ((maxValue - arr[i].amount / 10000) / diff) * graphHeight;
    }
    x += gap;
    path += `S${prevX + gap / 2} ${y}, ${x} ${y} `;
    prevX = x;
  }

  return (
    <View style={styles.graphContainer}>
      <Svg height={graphHeight} width={graphWidth}>
        <Path d={path} fill="none" stroke="#835eeb" strokeWidth={3} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  graphContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: color.main,
  },
});

export default DealInfoGraph;
