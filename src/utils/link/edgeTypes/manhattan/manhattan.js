'use strict';

import _ from 'lodash';
import { _calcOrientation} from './_utils.js';
import { _route, LEFT, RIGHT, TOP, BOTTOM, getRadiusPath, getDefaultPath } from './_utils.js';

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
  ;
  // link:connect 中 orientation = undefined
  _route(pointArr, fromPt, orientation[sourcePoint.orientation.join('')], toPt, orientation[targetPoint.orientation.join('')]);
  if (pointArr.length < 2) return '';
  if (pointArr.length === 2) {
    return {
      path: `M ${pointArr[0].x} ${pointArr[0].y} L ${pointArr[1].x} ${pointArr[1].y}`,
      breakPoints: pointArr
    };
  }
  pointArr.pop();
  if (options.hasRadius) {
    if (pointArr.length < 3) {
      return {
        path: getDefaultPath(pointArr),
        breakPoints: pointArr
      };
    }

    return getRadiusPath(pointArr)
  }
  else {
    return {
      path: getDefaultPath(pointArr),
      breakPoints: pointArr
    };
  }
}


export default drawManhattan;
