import React, {useMemo, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
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
import {GroupByDate} from '../../db/db';
import useDebounceEvent from '../../hooks/useDebounceEvent';

const graphWidth = Dimensions.get('window').width - 40 - 40;
const graphHeight = graphWidth * 0.4;
const graphPadding = 20;
const chartHeight = 40;
const radius = 5;
const gap = graphWidth / 36;

type Props = {
  dealInfoGroup: GroupByDate[];
  type: 'Deal' | 'Lease';
  loading: boolean;
};

const DealInfoGraph = ({dealInfoGroup, type, loading}: Props) => {
  const x = useSharedValue(graphWidth);
  const tooltipWidth = useSharedValue(0);
  const graphData = getGraphData(dealInfoGroup);
  const [tooltipText, setTooltipText] = useState(
    `${graphData[graphData.length - 1].year}.${
      graphData[graphData.length - 1].month < 10
        ? `0${graphData[graphData.length - 1].month}`
        : graphData[graphData.length - 1].month
    } 평균 ${graphData[graphData.length - 1].displayedAmount} (${
      graphData[graphData.length - 1].count
    }건)`,
  );
  const enqueueSetTooltipText = useDebounceEvent(100);
  const changeTooltipText = (index: number) => {
    setTooltipText(
      `${graphData[index].year}.${
        graphData[index].month < 10
          ? `0${graphData[index].month}`
          : graphData[index].month
      } 평균 ${graphData[index].displayedAmount} (${graphData[index].count}건)`,
    );
  };
  const enqueueChangeText = enqueueSetTooltipText(changeTooltipText);

  const maxValue = Math.ceil(
    Math.max(...graphData.map(value => value.amount)) / 10000,
  );
  const minValue =
    Math.floor(
      Math.min(
        ...graphData.map(value => value.amount).filter(value => value !== 0),
      ) / 10000,
    ) - 1;
  const maxCount = Math.max(...graphData.map(value => value.count));

  const diff = maxValue !== minValue ? maxValue - minValue : 1;
  const path = useMemo(
    () =>
      getGraphPath(
        maxValue,
        diff,
        gap,
        graphHeight,
        graphData.map(data => data.amount / 10000),
        0,
        'S',
      ),
    [diff, graphData, maxValue],
  );

  const dataIndex = useDerivedValue(() => {
    return Math.min(
      Math.max(Math.round(x.value / gap), 0),
      graphData.length - 1,
    );
  });

  useAnimatedReaction(
    () => dataIndex.value,
    index => {
      runOnJS(enqueueChangeText)(index);
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
  }, [x.value, dataIndex, graphData]);

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
            graphWidth - x.value + graphPadding >= tooltipWidth.value / 2
              ? x.value - tooltipWidth.value / 2 > -graphPadding
                ? x.value - graphWidth - graphPadding + tooltipWidth.value / 2
                : -graphWidth - graphPadding * 2 + tooltipWidth.value
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
            line={4}
            maxValue={graphHeight}
            gap={graphHeight / 3}
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
            {
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              backgroundColor: type === 'Deal' ? color.main : '#3D9752',
            },
            circleAnimatedStyle,
          ]}
        />
        <Animated.View
          style={[styles.tooltip, tooltipAnimatedStyle]}
          onLayout={event =>
            (tooltipWidth.value = event.nativeEvent.layout.width)
          }>
          <Text style={{color: 'white', fontWeight: '500'}}>{tooltipText}</Text>
        </Animated.View>
        <View style={styles.chartContainer}>
          {graphData.map((data, index) => (
            <Animated.View
              key={index}
              style={{
                position: 'absolute',
                bottom: 0,
                left: -gap / 4 + gap * index + 0.25,
                width: gap / 2,
                height:
                  maxCount > 0
                    ? ((data.count / maxCount) * chartHeight) / 1.5
                    : 0,
                backgroundColor:
                  dataIndex.value === index
                    ? type === 'Deal'
                      ? color.main
                      : '#3D9752'
                    : 'darkgray',
              }}
            />
          ))}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  graphContainer: {
    marginVertical: 50,
    paddingHorizontal: graphPadding,
  },
  chartContainer: {
    height: chartHeight,
    borderBottomWidth: 0.5,
    borderColor: 'lightgray',
  },
  line: {
    position: 'absolute',
    width: 0.5,
    top: -25,
    height: graphHeight + chartHeight + 39,
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

export default React.memo(DealInfoGraph);
