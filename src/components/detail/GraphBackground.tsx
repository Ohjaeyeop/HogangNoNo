import React from 'react';
import {Line} from 'react-native-svg';
import {color} from '../../theme/color';

type Props = {
  graphHeight: number;
  graphWidth: number;
  line: number;
};

const GraphBackground = React.memo<Props>(({graphHeight, graphWidth, line}) => {
  return (
    <>
      {[...new Array(line).keys()].map(index => (
        <Line
          x1="0"
          y1={(index * graphHeight) / (line - 1)}
          x2={graphWidth}
          y2={(index * graphHeight) / (line - 1)}
          stroke={color.gray}
          strokeWidth={1}
          key={index}
        />
      ))}
    </>
  );
});

export default GraphBackground;
