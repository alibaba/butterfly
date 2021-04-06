'use strict';
import {_calcOrientation, _route, LEFT, RIGHT, TOP, BOTTOM} from './_utils.js';

function drawManhattan(sourcePoint, targetPoint) {
  if (!sourcePoint.orientation) {
    sourcePoint.orientation = _calcOrientation(targetPoint.pos[0], targetPoint.pos[1], sourcePoint.pos[0], sourcePoint.pos[1]);
  }

  if (!targetPoint.orientation) {
    targetPoint.orientation = _calcOrientation(sourcePoint.pos[0], sourcePoint.pos[1], targetPoint.pos[0], targetPoint.pos[1]);
  }

  const pointArr = [];
  const fromPt = {
    x: sourcePoint.pos[0],
    y: sourcePoint.pos[1],
  };
  const toPt = {
    x: targetPoint.pos[0],
    y: targetPoint.pos[1],
  };
  const orientation = {
    '-10': LEFT,
    '10': RIGHT,
    '0-1': TOP,
    '01': BOTTOM,
  };
  // link:connect 中 orientation = undefined
  _route(pointArr, fromPt, orientation[sourcePoint.orientation.join('')], toPt, orientation[targetPoint.orientation.join('')]);
  if (pointArr.length < 2) return '';
  const path = pointArr.reduce((path, point) => {
    path.push([
      'L',
      point.x,
      point.y
    ].join(' '));
    return path;
  }, [[
    'M',
    pointArr[0].x,
    pointArr[0].y
  ].join(' ')]).join(' ');
  return path;
}

export default drawManhattan;
