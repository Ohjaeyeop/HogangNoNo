import React from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {color} from '../theme/color';

type Props = {
  height: number;
  width: number;
  maxValue: number;
  startValue: number;
  setIncreaseRate: React.Dispatch<React.SetStateAction<number>>;
};

const radius = 10;

const Slider = ({
  height,
  width,
  startValue,
  maxValue,
  setIncreaseRate,
}: Props) => {
  const offset = useSharedValue((width * startValue) / maxValue - radius);

  const animatedCircleStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offset.value}],
    };
  });
  const animatedColorBarStyles = useAnimatedStyle(() => {
    return {
      width: offset.value + radius,
    };
  });

  const start = useSharedValue((width * startValue) / maxValue - radius);
  const panGesture = useAnimatedGestureHandler({
    onActive: event => {
      offset.value = Math.min(
        width - radius,
        Math.max(0, event.translationX + start.value),
      );
      runOnJS(setIncreaseRate)(
        Math.round((maxValue * offset.value) / (width - radius)),
      );
    },
    onFinish: () => {
      start.value = offset.value;
    },
  });

  return (
    <View
      style={{
        height: height,
        width: width,
        backgroundColor: color.gray,
        borderRadius: 5,
      }}>
      <Animated.View
        style={[
          {height: height, backgroundColor: color.main, borderRadius: 5},
          animatedColorBarStyles,
        ]}
      />
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View
          style={[
            styles.sliderCircle,
            {top: -radius + height / 2},
            animatedCircleStyles,
          ]}
        />
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderCircle: {
    position: 'absolute',
    zIndex: 1,
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    borderWidth: 0.5,
    borderColor: 'gray',
    backgroundColor: 'white',
  },
});

export default Slider;
