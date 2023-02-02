'use strict';
import _ from 'lodash';

// Point对象声明
export const Point = function (x, y) {
  this.x = x;
  this.y = y;
}

// 方向常量
export const LEFT = 'Left';
export const RIGHT = 'Right';
export const TOP = 'Top';
export const BOTTOM = 'Bottom';

// manhattan线段加圆角函数
const DEFAULT_RADIUS = 15;
export const getRadiusPath = (pointArr) => {
  let path = ""
  let radius = DEFAULT_RADIUS;

  // radius优化前
  // const [start, c1, c2] = pointArr;
  // const end = pointArr[pointArr.length - 1]
  // if (Math.abs(start.y - end.y) < 2 * DEFAULT_RADIUS) {
  //   radius = Math.abs(start.y - end.y) / 2;
  // }

  //radius优化后: #867
  const end = pointArr[pointArr.length - 1];
  for (let i = 1; i < pointArr.length; i++) {
    const curr = pointArr[i];
    const prev = pointArr[i - 1];

    const length = Math.max(Math.abs(prev.x - curr.x), Math.abs(prev.y - curr.y));

    radius = Math.min(radius, length / 2);
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
    arc = [...arc, getDrawPoint(pointArr[i], pointArr[i + 1], pointArr[i + 2], radius, i)]
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
        path = path + " " + ((index === 0 ? ['M', e[0].x, e[0].y] : []).concat([
          'L', e[1].x, e[1].y,
          'A', radius, radius, 90, 0, e[3], e[2].x, e[2].y
        ])).join(" ");
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
const getDrawPoint = (start, control, end, radius, i) => {
  let p1 = getThatPoint(start, control, radius);
  let p2 = getThatPoint(end, control, radius);
  let flag = 0;
  let center = new Point(
    (start.x + end.x) / 2,
    (start.y + end.y) / 2
  );

  // 逆时针
  if (control.y < center.y) {
    // if (i === 4) console.log('123');
    flag = 1;
  }
  else {
    // if (i === 4) console.log('234');
    flag = 0;
  }
  if (start["x"] > end["x"]) {
    // if (i === 4) console.log('345');
    flag = flag === 1 ? 0 : 1
  }
  // if (i === 4) console.log('567');
  return [start, p1, p2, flag];
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


// 关键点生成path的函数
export const getDefaultPath = (pointArr) => {
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


// 曼哈顿折线路由算法
const MINDIST = 20;
export const TOL = 0.1;
export const TOLxTOL = 0.01;
const TOGGLE_DIST = 20;
export function _route(conn, fromPt, fromDir, toPt, toDir) {
  // 防止图上节点隐藏NaN的死循环问题
  fromPt.x = fromPt.x || 0;
  fromPt.y = fromPt.y || 0;
  toPt.x = toPt.x || 0;
  toPt.y = toPt.y || 0;

  const xDiff = fromPt.x - toPt.x;
  const yDiff = fromPt.y - toPt.y;
  let point;
  let dir;
  let pos;

  conn.push(new Point(fromPt.x, fromPt.y));

  if (((xDiff * xDiff) < (TOLxTOL)) && ((yDiff * yDiff) < (TOLxTOL))) {
    //认为可以是直线情况
    conn.push(new Point(toPt.x, toPt.y));
    return;
  }

  if (fromDir === LEFT) {
    if ((xDiff > 0) && ((yDiff * yDiff) < TOL) && (toDir === RIGHT)) {
      point = toPt
      dir = toDir
    }
    else {
      if (xDiff < 0) {
        point = new Point(fromPt.x - MINDIST, fromPt.y);
      }
      else if (((yDiff > 0) && (toDir === BOTTOM)) || ((yDiff < 0) && (toDir === TOP))) {
        point = new Point(toPt.x, fromPt.y);
      }
      else if (fromDir === toDir) {
        pos = Math.min(fromPt.x, toPt.x) - MINDIST;
        point = new Point(pos, fromPt.y);
      }
      else {
        point = new Point(fromPt.x - (xDiff / 2), fromPt.y);
      }
      if (yDiff > 0) {
        dir = TOP
      }
      else {
        dir = BOTTOM
      }
    }
  }
  else if (fromDir === RIGHT) {
    if ((xDiff < 0) && ((yDiff * yDiff) < TOL) && (toDir === LEFT)) {
      point = toPt
      dir = toDir
    }
    else {
      if (xDiff > 0) {
        point = new Point(fromPt.x + MINDIST, fromPt.y);
      }
      else if (((yDiff > 0) && (toDir === BOTTOM)) || ((yDiff < 0) && (toDir === TOP))) {
        point = new Point(toPt.x, fromPt.y);
      }
      else if (fromDir === toDir) {
        pos = Math.max(fromPt.x, toPt.x) + MINDIST;
        point = new Point(pos, fromPt.y);
      }
      else {
        point = new Point(fromPt.x - (xDiff / 2), fromPt.y);
      }

      if (yDiff > 0) {
        dir = TOP;
      }
      else {
        dir = BOTTOM;
      }
    }
  }
  else if (fromDir === BOTTOM) {
    if (((xDiff * xDiff) < TOL) && (yDiff < 0) && (toDir === TOP)) {
      point = toPt;
      dir = toDir;
    }
    else {
      if (yDiff > 0) {
        point = new Point(fromPt.x, fromPt.y + MINDIST);
      }
      else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) {
        point = new Point(fromPt.x, toPt.y);
      }
      else if (fromDir === toDir) {
        pos = Math.max(fromPt.y, toPt.y) + MINDIST;
        point = new Point(fromPt.x, pos);
      }
      else {
        point = { x: fromPt.x, y: fromPt.y - (yDiff / 2) };
      }

      if (xDiff > 0) {
        dir = LEFT;
      }
      else {
        dir = RIGHT;
      }
    }
  } else if (fromDir === TOP) {
    if (((xDiff * xDiff) < TOL) && (yDiff > 0) && (toDir === BOTTOM)) {
      point = toPt;
      dir = toDir;
    }
    else {
      if (yDiff < 0) {
        point = new Point(fromPt.x, fromPt.y - MINDIST);
      }
      else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) {
        point = new Point(fromPt.x, toPt.y);
      }
      else if (fromDir === toDir) {
        pos = Math.min(fromPt.y, toPt.y) - MINDIST;
        point = new Point(fromPt.x, pos);
      }
      else {
        point = { x: fromPt.x, y: fromPt.y - (yDiff / 2) };
      }

      if (xDiff > 0) {
        dir = LEFT;
      }
      else {
        dir = RIGHT;
      }
    }
  }
  _route(conn, point, dir, toPt, toDir);

}