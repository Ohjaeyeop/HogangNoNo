import React from 'react';
import {Dimensions, StyleSheet, Text} from 'react-native';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import Svg, {Path} from 'react-native-svg';
import {getGraphData} from '../../libs/getGraphData';
import {color} from '../../theme/color';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {getGraphPath} from '../../libs/getGraphPath';

const graphWidth = Dimensions.get('window').width - 40 - 40;
const graphHeight = graphWidth * 0.4;
const radius = 5;

const DealInfoGraph = ({dealInfoGroup}: {dealInfoGroup: ResultSetRowList}) => {
  const arr = getGraphData(dealInfoGroup);
  const maxValue = Math.ceil(
    Math.max(...arr.map(value => value.amount)) / 10000,
  );
  const minValue = Math.floor(
    Math.min(...arr.map(value => value.amount).filter(value => value !== 0)) /
      10000,
  );
  const path = getGraphPath(maxValue, minValue, graphWidth, graphHeight, arr);
  const x = useSharedValue(graphWidth);
  const y = useSharedValue(0);

  const circleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: x.value}],
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx: any) => {
      x.value = event.x - 20;
    },
    onActive: (event, ctx: any) => {
      x.value = Math.min(
        Math.max(x.value + event.translationX, -radius),
        graphWidth + radius,
      );
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={styles.graphContainer}>
        <Svg height={graphHeight} width={graphWidth}>
          <Path d={path} fill="none" stroke="#835eeb" strokeWidth={3} />
        </Svg>
        <Animated.View style={[styles.circle, circleAnimatedStyle]} />
        <Animated.View style={styles.tooltip}>
          <Text style={{color: 'white', fontWeight: '500'}}>
            2021.10 평균 55억 (0건)
          </Text>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  graphContainer: {
    marginVertical: 40,
    paddingHorizontal: 20,
  },
  circle: {
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    backgroundColor: color.main,
  },
  tooltip: {
    position: 'absolute',
    right: 0,
    top: -30,
    backgroundColor: color.main,
    paddingHorizontal: 12,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DealInfoGraph;
