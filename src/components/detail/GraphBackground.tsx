import React from 'react';
import {Line} from 'react-native-svg';
import {color} from '../../theme/color';

type Props = {
  graphHeight: number;
  graphWidth: number;
  arr: number[];
};

const GraphBackground = React.memo<Props>(({graphHeight, graphWidth, arr}) => {
  return (
    <>
      {arr.map(index => (
        <Line
          x1="0"
          y1={(index * graphHeight) / 3}
          x2={graphWidth}
          y2={(index * graphHeight) / 3}
          stroke={color.gray}
          strokeWidth="2"
          key={index}
        />
      ))}
    </>
  );
});

export default GraphBackground;
