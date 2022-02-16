export const getGraphPath = (
  maxValue: number,
  diff: number,
  gap: number,
  graphHeight: number,
  graphData: number[],
  startPoint: number,
  lineType: string,
) => {
  let y =
    graphData[0] === 0
      ? graphHeight
      : ((maxValue - graphData[0]) / diff) * graphHeight;
  let x = startPoint;
  let prevX = 0;
  let prevY = y;
  let path = `M${startPoint} ${y} `;

  for (let i = 1; i < graphData.length; i++) {
    if (graphData[i] !== 0) {
      y = ((maxValue - graphData[i]) / diff) * graphHeight;
    }
    x += gap;
    path +=
      lineType === 'S'
        ? `S${prevX + gap / 2} ${y}, ${x} ${y} `
        : `S${prevX + gap / 2} ${prevY} ${x} ${y} `;
    prevX = x;
    prevY = y;
  }

  return path;
};
