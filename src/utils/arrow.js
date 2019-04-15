'use strict';

// todo:丰富箭头样式
const arrow = {
    default1: 'M0 0 L-3 3 L2 0 L-3 -3 Z0 0',
    default: `M5 0 L0 -2 Q 1.0 0 0 2 Z5 0`,
    length: 5,
};

// 计算线条某个位置的斜率
function calcSlope(opts) {
  let shapeType = _.get(opts, 'shapeType');
  let dom = _.get(opts, 'dom');
  let arrowPosition = _.get(opts, 'arrowPosition', 0.5);
  let path = _.get(opts, 'path');
  let coordinates = path.split(' ');
  let x = 0;
  let y = 0;
  
  if (shapeType === 'Bezier') {
    let p0 = {x: coordinates[8], y: coordinates[9]};
    let p1 = {x: coordinates[6], y: coordinates[7]};
    let p2 = {x: coordinates[4], y: coordinates[5]};
    let p3 = {x: coordinates[1], y: coordinates[2]};

    arrowPosition = 1 - arrowPosition; // 贝塞尔曲线是反着画的，需要调整
    x = -3 * p0.x * (1 - arrowPosition) * (1 - arrowPosition) +
      3 * p1.x * ((1 - arrowPosition) * (1 - arrowPosition) - 2 * arrowPosition * (1 - arrowPosition)) +
      3 * p2.x * (2 * arrowPosition - 3 * arrowPosition * arrowPosition) +
      3 * p3.x * arrowPosition * arrowPosition;
    y = -3 * p0.y * (1 - arrowPosition) * (1 - arrowPosition) +
      3 * p1.y * ((1 - arrowPosition) * (1 - arrowPosition) - 2 * arrowPosition * (1 - arrowPosition)) +
      3 * p2.y * (2 * arrowPosition - 3 * arrowPosition * arrowPosition) +
      3 * p3.y * arrowPosition * arrowPosition;
  } else if (shapeType === 'Straight') {
    let p0 = {x: coordinates[1], y: coordinates[2]};
    let p1 = {x: coordinates[4], y: coordinates[5]};

    x = p1.x - p0.x;
    y = p1.y - p0.y;
  } else if (shapeType === 'Flow') {
    let p0 = 0;
    let p1 = 1;

    if (arrowPosition !== 1) {
      p0 = dom.getPointAtLength(dom.getTotalLength() * arrowPosition);
      p1 = dom.getPointAtLength(dom.getTotalLength() * arrowPosition + 0.001);
    } else {
      p0 = dom.getPointAtLength(dom.getTotalLength() * arrowPosition - 0.001);
      p1 = dom.getPointAtLength(dom.getTotalLength() * arrowPosition);
    }
    

    x = p1.x - p0.x;
    y = p1.y - p0.y;
  }
  
  return {x, y};
}

module.exports = {
  calcSlope,
  arrow
};