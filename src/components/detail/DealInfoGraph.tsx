import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text} from 'react-native';
import {ResultSetRowList} from 'react-native-sqlite-storage';
import Svg, {Path} from 'react-native-svg';
import {getGraphData} from '../../libs/getGraphData';
import {color} from '../../theme/color';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {getGraphPath} from '../../libs/getGraphPath';
import {displayedAmount} from '../../libs/displayedAmount';

const graphWidth = Dimensions.get('window').width - 40 - 40;
const graphHeight = graphWidth * 0.4;
const radius = 5;

const DealInfoGraph = ({dealInfoGroup}: {dealInfoGroup: ResultSetRowList}) => {
  const [tooltipText, setTooltipText] = useState('');
  const graphData = getGraphData(dealInfoGroup);
  const maxValue = Math.ceil(
    Math.max(...graphData.map(value => value.amount)) / 10000,
  );
  const minValue = Math.floor(
    Math.min(
      ...graphData.map(value => value.amount).filter(value => value !== 0),
    ) / 10000,
  );
  const gap = graphWidth / 36;
  const path = getGraphPath(maxValue, minValue, gap, graphHeight, graphData);

  const x = useSharedValue(graphWidth);
  const dataIndex = useDerivedValue(() => {
    return Math.min(
      Math.max(Math.floor(x.value / gap), 0),
      graphData.length - 1,
    );
  });

  useAnimatedReaction(
    () => dataIndex.value,
    index => {
      runOnJS(setTooltipText)(
        `${graphData[index].year}.${graphData[index].month} 평균 ${graphData[index].displayedAmount} (${graphData[index].count}건)`,
      );
    },
  );

  const circleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: x.value}],
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx: any) => {
      x.value = Math.min(Math.max(event.x - 20, -radius), graphWidth + radius);
      ctx.startX = x.value;
    },
    onActive: (event, ctx: any) => {
      x.value = Math.min(
        Math.max(ctx.startX + event.translationX, -radius),
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
          <Text style={{color: 'white', fontWeight: '500'}}>{tooltipText}</Text>
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
