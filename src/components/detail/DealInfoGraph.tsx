import React, {useMemo, useState} from 'react';
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
import GraphBackground from './GraphBackground';

const graphWidth = Dimensions.get('window').width - 40 - 40;
const graphHeight = graphWidth * 0.4;
const graphPadding = 20;
const radius = 5;

const DealInfoGraph = ({
  dealInfoGroup,
  type,
}: {
  dealInfoGroup: ResultSetRowList;
  type: 'Deal' | 'Lease';
}) => {
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipWidth, setTooltipWidth] = useState(0);
  const arr = useMemo(() => [0, 1, 2, 3], []);
  const graphData = getGraphData(dealInfoGroup);
  const maxValue = Math.ceil(
    Math.max(...graphData.map(value => value.amount)) / 10000,
  );
  const minValue =
    Math.floor(
      Math.min(
        ...graphData.map(value => value.amount).filter(value => value !== 0),
      ) / 10000,
    ) - 1;

  const gap = graphWidth / 36;
  const diff = maxValue !== minValue ? maxValue - minValue : 1;
  const path = getGraphPath(maxValue, diff, gap, graphHeight, graphData);

  const x = useSharedValue(graphWidth);
  const dataIndex = useDerivedValue(() => {
    return Math.min(
      Math.max(Math.round(x.value / gap), 0),
      graphData.length - 1,
    );
  });

  useAnimatedReaction(
    () => dataIndex.value,
    index => {
      runOnJS(setTooltipText)(
        `${graphData[index].year}.${
          graphData[index].month < 10
            ? `0${graphData[index].month}`
            : graphData[index].month
        } 평균 ${graphData[index].displayedAmount} (${
          graphData[index].count
        }건)`,
      );
    },
  );

  const circleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: x.value - radius},
        {
          translateY:
            graphData[dataIndex.value].amount === 0
              ? -radius - 2
              : ((maxValue - graphData[dataIndex.value].amount / 10000) / diff -
                  1) *
                  graphHeight -
                radius -
                2,
        },
      ],
    };
  });

  const lineAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: x.value + graphPadding}],
    };
  });

  const tooltipAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX:
            graphWidth - x.value + graphPadding >= tooltipWidth / 2
              ? x.value - tooltipWidth / 2 > -graphPadding
                ? x.value - graphWidth - graphPadding + tooltipWidth / 2
                : -graphWidth - graphPadding * 2 + tooltipWidth
              : 0,
        },
      ],
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx: any) => {
      x.value = Math.min(Math.max(event.x - graphPadding, 0), graphWidth);
      x.value = Math.round(x.value / gap) * gap;
      ctx.startX = x.value;
    },
    onActive: (event, ctx: any) => {
      x.value = Math.min(
        Math.max(ctx.startX + event.translationX, 0),
        graphWidth,
      );
      x.value = Math.round(x.value / gap) * gap;
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={styles.graphContainer}>
        <Svg
          height={graphHeight + 4}
          width={graphWidth}
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
          <GraphBackground
            graphHeight={graphHeight}
            graphWidth={graphWidth}
            arr={arr}
          />
          <Path
            d={path}
            fill="none"
            stroke={type === 'Deal' ? color.main : '#3D9752'}
            strokeWidth={3}
          />
        </Svg>
        <Animated.View style={[styles.line, lineAnimatedStyle]} />
        <Animated.View
          style={[
            styles.circle,
            circleAnimatedStyle,
            {backgroundColor: type === 'Deal' ? color.main : '#3D9752'},
          ]}
        />
        <Animated.View
          style={[styles.tooltip, tooltipAnimatedStyle]}
          onLayout={event => setTooltipWidth(event.nativeEvent.layout.width)}>
          <Text style={{color: 'white', fontWeight: '500'}}>{tooltipText}</Text>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  graphContainer: {
    marginVertical: 40,
    paddingHorizontal: graphPadding,
  },
  circle: {
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
  },
  line: {
    position: 'absolute',
    width: 0.5,
    top: -30,
    height: graphHeight + 50,
    backgroundColor: 'black',
  },
  tooltip: {
    position: 'absolute',
    top: -50,
    right: 0,
    backgroundColor: color.main,
    paddingHorizontal: 12,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DealInfoGraph;
