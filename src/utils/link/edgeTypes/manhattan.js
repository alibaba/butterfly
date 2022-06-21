'use strict';

import _ from 'lodash';
import { _calcOrientation, _route, LEFT, RIGHT, TOP, BOTTOM, DEFAULT_RADIUS, Point } from './_utils.js';
const getDefaultPath = (pointArr) => {
  let path = pointArr.reduce((path, point) => {
    path.push([
      'L',
      point.x,
      point.y
    ].join(' '));
    return path;
  }, [
    [
      'M',
      pointArr[0].x,
      pointArr[0].y
    ].join(' ')
  ]).join(' ');
  return path
};
// 获得靠近end的点
const getThatPoint = (start, end, radius) => {
  let p = new Point();

  ['x', 'y'].forEach(key => {
    if (start[key] > end[key]) {
      p[key] = end[key] + radius;
    }
    else if (start[key] < end[key]) {
      p[key] = end[key] - radius;
    }
    else {
      p[key] = start[key];
    }
  });

  return p;
};
const getDrawPoint = (start, control, end, radius) => {
  let p1 = getThatPoint(start, control, radius);
  let p2 = getThatPoint(end, control, radius);
  let flag = 0;
  let center = new Point(
    (start.x + end.x) / 2,
    (start.y + end.y) / 2
  );

  // 逆时针
  if (control.y < center.y) {
    flag = 1;
  }
  else {
    flag = 0;
  }
  if (start["x"] > end["x"]) {
    flag = flag === 1 ? 0 : 1
  }

  return [start, p1, p2, flag];
};
function getRadiusPath(pointArr) {
  let path = ""
  let radius = DEFAULT_RADIUS;
  const [start, c1, c2] = pointArr;
  const end = pointArr[pointArr.length - 1]
  if (Math.abs(start.y - end.y) < 2 * DEFAULT_RADIUS) {
    radius = Math.abs(start.y - end.y) / 2;
  }

  if (
    _.first(pointArr).x === _.last(pointArr).x ||
    _.first(pointArr).y === _.last(pointArr).y
  ) {
    path = [
      'M', _.first(pointArr).x, _.first(pointArr).y,
      'L', _.last(pointArr).x, _.last(pointArr).y
    ].join(' ');
    return {
      path,
      breakPoints: pointArr
    };
  }

  if (_.first(pointArr).x > _.last(pointArr).x) {
    //pointArr = pointArr.reverse();
  }
  let arc = []
  for (let i = 0; i < pointArr.length - 2; i++) {
    arc = [...arc, getDrawPoint(pointArr[i], pointArr[i + 1], pointArr[i + 2], radius)]
  }

  arc.forEach((e, index) => {
    if (index % 2 == 0) {
      if (index === 2) {
        path = path + " " + [
          'L', e[1].x, e[1].y,
          'M', e[1].x, e[1].y,
          'A', radius, radius, 90, 0, e[3], e[2].x, e[2].y
        ].join(" ")
      }
      else {
        path = path + " " + [
          'M', e[0].x, e[0].y,
          'L', e[1].x, e[1].y,
          'A', radius, radius, 90, 0, e[3], e[2].x, e[2].y
        ].join(" ")
      }

    }
    else {
      path = path + " " + [
        'L', e[1].x, e[1].y,
        'M', e[1].x, e[1].y,
        'A', radius, radius, 90, 0, e[3], e[2].x, e[2].y
      ].join(" ")
    }

  })
  path = path + ['L', end.x, end.y].join(" ")
  return {
    path,
    breakPoints: pointArr
  };
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
