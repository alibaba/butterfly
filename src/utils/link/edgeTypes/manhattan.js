'use strict';

import _ from 'lodash';
import {_calcOrientation, _route, LEFT, RIGHT, TOP, BOTTOM} from './_utils.js';

function _drawPath (breakPoints) {
  return breakPoints.reduce((path, point) => {
    path.push([
      'L',
      point.x,
      point.y
    ].join(' '));
    return path;
  }, [[
    'M',
    breakPoints[0].x,
    breakPoints[0].y
  ].join(' ')]).join(' ');
}

function drawManhattan(sourcePoint, targetPoint, options) {

  // 不需要计算，直接使用传入的拐点画线
  if (options.draggable && options.hasDragged) {
    return {
      path: _drawPath(options.breakPoints),
      breakPoints: options.breakPoints
    }
  }
  
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
  const path = _drawPath(pointArr);
  return {
    path,
    breakPoints: pointArr
  };
}


export default drawManhattan;
