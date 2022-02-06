import {DealInfoGroupType} from './getGraphData';

export const getGraphPath = (
  maxValue: number,
  diff: number,
  gap: number,
  graphHeight: number,
  graphData: DealInfoGroupType[],
) => {
  let y =
    graphData[0].amount === 0
      ? graphHeight
      : ((maxValue - graphData[0].amount / 10000) / diff) * graphHeight;
  let x = 0;
  let prevX = 0;
  let path = `M0 ${y} `;

  for (let i = 0; i < graphData.length; i++) {
    if (graphData[i].amount !== 0) {
      y = ((maxValue - graphData[i].amount / 10000) / diff) * graphHeight;
    }
    x += gap;
    path += `S${prevX + gap / 2} ${y}, ${x} ${y} `;
    prevX = x;
  }

  return path;
};
