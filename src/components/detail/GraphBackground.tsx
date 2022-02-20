import React from 'react';
import {Line, Text} from 'react-native-svg';
import {color} from '../../theme/color';
import {View} from 'react-native';

type Props = {
  graphHeight: number;
  graphWidth: number;
  line: number;
  maxValue: number;
  gap: number;
};

const GraphBackground = React.memo<Props>(
  ({graphHeight, graphWidth, line, maxValue, gap}) => {
    return (
      <>
        {[...new Array(line).keys()].map(index => (
          <Line
            x1="0"
            y1={graphHeight - ((graphHeight * gap) / maxValue) * index}
            x2={graphWidth}
            y2={graphHeight - ((graphHeight * gap) / maxValue) * index}
            stroke={color.gray}
            strokeWidth={1}
            key={index}
          />
        ))}
      </>
    );
  },
);

export default GraphBackground;
