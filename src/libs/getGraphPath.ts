import {DealInfoGroupType} from './getGraphData';

export const getGraphPath = (
  maxValue: number,
  minValue: number,
  graphWidth: number,
  graphHeight: number,
  arr: DealInfoGroupType[],
) => {
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

  return path;
};
