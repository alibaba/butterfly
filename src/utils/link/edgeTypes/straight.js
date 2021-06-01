'use strict';

function drawStraight(sourcePoint, targetPoint) {
  let result = ['M', sourcePoint.pos[0], sourcePoint.pos[1], 'L', targetPoint.pos[0], targetPoint.pos[1]];
  return result.join(' ');
}
export default drawStraight;
