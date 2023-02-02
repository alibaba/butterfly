'use strict';

import _ from 'lodash';
import {getAvoidObstaclesInfo, _calcOrientation, Point, _route, DEFAULT_RADIUS} from '../_utils'; 
import ObstacleMap from './obstacleMap';

let MINDIST = 20;
const TOL = 0.1;
const TOLxTOL = 0.01;
const LEFT = 'Left';
const RIGHT = 'Right';
const TOP = 'Top';
const BOTTOM = 'Bottom';


// const orientationOffet = (pos, orientation, girdGap) => {
//   let _ori = orientation.toString();
//   let res = pos;
//   if (_ori === '0,1') {
//     res[1] += girdGap;
//   } else if (_ori === '0,-1') {
//     res[1] -= girdGap;
//   } else if (_ori === '1,0') {
//     res[0] += girdGap;
//   } else if (_ori === '-1,0') {
//     res[0] -= girdGap;
//   }
//   return res;
// }


// 寻找两点直线能否合并，无障碍即可合并
const _isMerge = (point1, point2, obstacleMap) => {
  let girdGap = obstacleMap.options.girdGap;
  let info = {
    canMerge: false
  };

  // console.log(point1);
  // console.log(point2);
  // console.log('-------');

  if (point1.x !== point2.x && point1.y !== point2.y) {

    let point1Cell = obstacleMap.getGirdCell(point1.x, point1.y);
    let point2Cell = obstacleMap.getGirdCell(point2.x, point2.y);

    let point3Cell = {
      xCell: point1Cell.xCell,
      yCell: point2Cell.yCell
    };
    let point4Cell = {
      xCell: point2Cell.xCell,
      yCell: point1Cell.yCell
    };

    let minX, maxX, minY, maxY;

    // 第一种情况：point1和point3 、 point2和point3计算
    let point1And3 = true, point2And3 = true;
    minY = point1Cell.yCell < point3Cell.yCell ? point1Cell.yCell : point3Cell.yCell;
    maxY = point1Cell.yCell > point3Cell.yCell ? point1Cell.yCell : point3Cell.yCell;
    for(let i = minY; i < maxY; i+= girdGap) {
      let key = `${point3Cell.xCell}@${i}`;
      if (obstacleMap.hasObstacles(key)) {
        // console.log(1);
        // console.log(key);
        point1And3 = false;
        break;
      }
    }

    minX = point2Cell.xCell < point3Cell.xCell ? point2Cell.xCell : point3Cell.xCell;
    maxX = point2Cell.xCell > point3Cell.xCell ? point2Cell.xCell : point3Cell.xCell;
    for(let i = minX; i < maxX; i+= girdGap) {
      let key = `${i}@${point3Cell.yCell}`;
      if (obstacleMap.hasObstacles(key)) {
        // console.log(2);
        // console.log(key);
        point2And3 = false;
        break;
      }
    }

    if (point1And3 && point2And3) {
      return _.assign(info, {
        canMerge: true,
        midPoint: {x: point1.x, y: point2.y}
      })
    }

    // 第二种情况：point1和point4 、 point2和point4计算
    let point1And4 = true, point2And4 = true;
    minX = point1Cell.xCell < point4Cell.xCell ? point1Cell.xCell : point4Cell.xCell;
    maxX = point1Cell.xCell > point4Cell.xCell ? point1Cell.xCell : point4Cell.xCell;
    for(let i = minX; i < maxX; i+= girdGap) {
      let key = `${i}@${point4Cell.yCell}`;
      if (obstacleMap.hasObstacles(key)) {
        // console.log(3);
        // console.log(key);
        point1And4 = false;
        break;
      }
    }

    minY = point2Cell.yCell < point4Cell.yCell ? point2Cell.yCell : point4Cell.yCell;
    maxY = point2Cell.yCell > point4Cell.yCell ? point2Cell.yCell : point4Cell.yCell;
    for(let i = minY; i < maxY; i+= girdGap) {
      let key = `${point4Cell.xCell}@${i}`;
      if (obstacleMap.hasObstacles(key)) {
        // console.log(4);
        // console.log(key);
        point2And4 = false;
        break;
      }
    }

    if (point1And4 && point2And4) {
      return _.assign(info, {
        canMerge: true,
        midPoint: {x: point2.x, y: point1.y}
      })
    }
  }

  return info;
}

const mergePoint = (pointArr, obstacleMap) => {
  let tmpPoint = pointArr.slice(1, pointArr.length - 1);
  if (tmpPoint.length <= 3) {
    return pointArr;
  }

  let startIndex, endIndex;

  for(let i = 0; i < tmpPoint.length / 2; i++) {
    for(let j = tmpPoint.length - 1; j > i; j--) {
      // i和j必须间隔3个节点才有意义
      if (j - i <= 2) {
        break;
      } 

      // 计算合并
      let mergeInfo = _isMerge(tmpPoint[i], tmpPoint[j], obstacleMap);
      if (mergeInfo.canMerge) {
        // console.log('能合并');
        // console.log(i);
        // console.log(j);
        // console.log(mergeInfo);
        // console.log(tmpPoint.splice(1,8, mergeInfo.midPoint));
        // console.log(tmpPoint);
        // console.log(tmpPoint.splice(i, j - i, mergeInfo.midPoint));
        startIndex = i;
        endIndex = j;
        tmpPoint.splice(i + 1, j - i - 1, mergeInfo.midPoint);
        // console.log(pointArr);
        tmpPoint.push(pointArr[pointArr.length - 1]);
        tmpPoint.unshift(pointArr[0]);
        // console.log(tmpPoint);
        // console.log(pointArr);
        return tmpPoint;
        // break;
      }
    }
    if (startIndex !== undefined && endIndex !== undefined ) {
      break;
    }
  }

  return pointArr;
}


// 根据节点生成最终路线
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
    console.log(i);
    console.log(getDrawPoint(pointArr[i], pointArr[i + 1], pointArr[i + 2], radius, i));
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

// 避开整个节点
const _avoidObstaclesLen = (currentCell, obstacleMap, dir, girdGap) => {
  let cell = _.cloneDeep(currentCell);
  let map = obstacleMap.map;
  let key = `${cell.x}@${cell.y}`;
  let cnt = 1;
  while(map[key] !== obstacleMap.MAP_CONST.EMPTY && map[key] !== undefined) {
    if (dir === BOTTOM) {
      cell.y += girdGap;
    } else if (dir === TOP) {
      cell.y -= girdGap;
    } else if (dir === LEFT) {
      cell.x -= girdGap;
    } else if (dir === RIGHT) {
      cell.x += girdGap;
    }
    key = `${cell.x}@${cell.y}`;
    cnt ++;
  }

  if (dir === TOP || dir === LEFT) {
    return -cnt * girdGap;
  } else {
    return cnt * girdGap;
  }
}

// 避障算法
const avoidObstacles = (conn, fromPt, fromDir, midPt, midDir, toPt, toDir, map, count) => {

  let resultPt = midPt, resultDir = midDir;

  const girdGap = map.options.girdGap;

  let fromGridInfo = map.getGirdCell(fromPt.x, fromPt.y);
  let midGridInfo = map.getGirdCell(midPt.x, midPt.y);

  // 开始坐标已经被占用了，直接返回
  // let key = '';
  // if (map.hasObstacles(fromGridInfo.key)) {
  //   return {
  //     code: 'NO_PATH'
  //   }
  // }
  
  // console.log(map.map);
  // console.log(fromPt);
  // console.log(fromDir);
  // console.log(midPt);
  // console.log(midDir);
  // console.log('----------');

  // 检查中途是否有障碍，有的话开始拐弯
  if(fromGridInfo.yCell === midGridInfo.yCell) { // 水平走向
    
    let _leftGridInfo = fromGridInfo.xCell < midGridInfo.xCell ? fromGridInfo : midGridInfo;
    let _rightGridInfo = fromGridInfo.xCell < midGridInfo.xCell ? midGridInfo : fromGridInfo;
    let _dirIndex = fromGridInfo.xCell < midGridInfo.xCell ? -1 : 1;
    
    // 检测障碍
    let hasObstacles = false;
    let index = undefined;

    if (fromGridInfo.xCell < midGridInfo.xCell) {
      for(let i = _leftGridInfo.xCell; i <= _rightGridInfo.xCell; i+= girdGap) {
        if (map.hasObstacles(`${i}@${fromGridInfo.yCell}`)) {
          hasObstacles = true;
          index = i;
          break;
        }
      }
    } else {
      for(let i = fromGridInfo.xCell; i >= midGridInfo.xCell; i-= girdGap) {
        if (map.hasObstacles(`${i}@${fromGridInfo.yCell}`)) {
          hasObstacles = true;
          index = i;
          break;
        }
      }
    }

    // console.log(hasObstacles);
    // 拐弯
    if (hasObstacles) {
      let expectDir = toPt.y > midPt.y ? 1 : -1;
      
      // 预测垂直外侧1格是否有阻碍
      let positiveDirObstacles = map.hasObstacles(`${index + _dirIndex * girdGap}@${fromGridInfo.yCell + expectDir * girdGap}`);
      let oppositeDirObstacles = map.hasObstacles(`${index + _dirIndex * girdGap}@${fromGridInfo.yCell - expectDir * girdGap}`);
      // todo: 坐标需要修正
      if (!positiveDirObstacles) {
        resultPt = {
          x: midGridInfo.x - (midGridInfo.xCell - (index + _dirIndex * girdGap)),
          y: fromGridInfo.y
        }
        conn.push(_.cloneDeep(resultPt));
        // 要不要直接全绕过
        // resultPt.y += expectDir * girdGap;
        // resultDir = expectDir === 1 ? Bottom : Top;
        resultPt.y += _avoidObstaclesLen({x: index, y: fromGridInfo.yCell}, map, expectDir === 1 ? BOTTOM : TOP, girdGap);
      } else if (positiveDirObstacles && !oppositeDirObstacles) {
        resultPt = {
          x: midGridInfo.x - (midGridInfo.xCell - (index + _dirIndex * girdGap)),
          y: fromGridInfo.y
        }
        conn.push(_.cloneDeep(resultPt));
        // 要不要直接全绕过
        // resultPt.y += expectDir * girdGap;
        // resultDir = expectDir === 1 ? Bottom : Top;
        resultPt.y += _avoidObstaclesLen({x: index, y: fromGridInfo.yCell}, map, expectDir === 1 ? BOTTOM : TOP, girdGap);
      } else {
        return {
          code: 'NO_PATH'
        }
      }
      return {
        code: 'CHANGE_DIR',
        correctPt: resultPt,
        correctDir: midDir
      }
    }

  } else if (fromGridInfo.xCell === midGridInfo.xCell) { // 垂直走向
    let _dirIndex = fromGridInfo.yCell < midGridInfo.yCell ? -1 : 1;

    // 检测障碍
    let hasObstacles = false;
    let index = undefined;
    if (fromGridInfo.yCell < midGridInfo.yCell) {
      for(let i = fromGridInfo.yCell; i <= midGridInfo.yCell; i+= girdGap) {
        if (map.hasObstacles(`${fromGridInfo.xCell}@${i}`)) {
          hasObstacles = true;
          index = i;
          break;
        }
      }
    } else {
      for(let i = fromGridInfo.yCell; i >= midGridInfo.yCell; i-= girdGap) {
        if (map.hasObstacles(`${fromGridInfo.xCell}@${i}`)) {
          hasObstacles = true;
          index = i;
          break;
        }
      }
    }
    // for(let i = _topGridInfo.yCell; i <= _bottomGridInfo.yCell; i+= girdGap) {
    //   if (map.hasObstacles(`${fromGridInfo.xCell}@${i}`)) {
    //     hasObstacles = true;
    //     index = i;
    //     break;
    //   }
    // }
    // console.log(hasObstacles);
    // 拐弯
    if (hasObstacles) {
      let expectDir = toPt.x > midPt.x ? 1 : -1;
      // 预测水平外侧1格是否有阻碍
      let positiveDirObstacles = map.hasObstacles(`${fromGridInfo.xCell + expectDir * girdGap}@${index + _dirIndex * girdGap}`);
      let oppositeDirObstacles = map.hasObstacles(`${fromGridInfo.xCell - expectDir * girdGap}@${index + _dirIndex * girdGap}`);
      if (!positiveDirObstacles) {
        resultPt = {
          x: fromGridInfo.x,
          y: midGridInfo.y - (midGridInfo.yCell - (index + _dirIndex * girdGap))
        }
        conn.push(_.cloneDeep(resultPt));
        resultPt.x += _avoidObstaclesLen({x: fromGridInfo.xCell, y: index}, map, expectDir === 1 ? RIGHT : LEFT, girdGap);
        // resultPt.x += expectDir * girdGap;
        // resultDir = expectDir === 1 ? RIGHT : LEFT;
      } else if (positiveDirObstacles && !oppositeDirObstacles) {
        resultPt = {
          x: fromGridInfo.x,
          y: midGridInfo.y - (midGridInfo.yCell - (index + _dirIndex * girdGap))
        }
        conn.push(_.cloneDeep(resultPt));
        // 要不要直接全绕过
        resultPt.x += _avoidObstaclesLen({x: fromGridInfo.xCell, y: index}, map, expectDir === 1 ? RIGHT : LEFT, girdGap);
        // resultPt.x += expectDir * girdGap;
        // resultDir = expectDir === 1 ? LEFT : RIGHT;
      } else {
        return {
          code: 'NO_PATH'
        }
      }
      return {
        code: 'CHANGE_DIR',
        correctPt: resultPt,
        correctDir: midDir
      }
    }

  } else { // 不需要走
    return {
      code: 'NO_NEED'
    }
  }
}

/**
 * 寻路算法
 * conn      线段关键点的数组
 * fromPt    开始位置
 * fromDir   开始位置的方向
 * toPt      结束位置
 * toDir     结束位置的方向
 * map       地图
 * count     步数
 */

 
const route = (conn, fromPt, fromDir, toPt, toDir, map, count) => {

  // 超过100个关键点直接返回
  if (count > 10) {
    conn.push(undefined);
    return;
  }

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

  // 避开障碍物
  let avoidAction = avoidObstacles(conn, fromPt, fromDir, point, dir, toPt, toDir, map, count);
  if (avoidAction && avoidAction.code === 'CHANGE_DIR') {
    point = avoidAction.correctPt;
    dir = avoidAction.correctDir;
  }

  route(conn, point, dir, toPt, toDir, map, count + 1);

}

// todo options暂时先写死
function drawAdvancedManhattan (sourcePoint, targetPoint, options) {

  let canvasData = getAvoidObstaclesInfo();

  // 后续可以优化这个内存
  let obstacleMap = new ObstacleMap();
  obstacleMap.build(canvasData.nodes);
  obstacleMap.initStatus(sourcePoint, targetPoint, options.sourceNodeId, options.targetNodeId);

  MINDIST = obstacleMap.options.girdGap * 2;

  const _oriMap = {
    '-1,0': LEFT,
    '1,0': RIGHT,
    '0,-1': TOP,
    '0,1': BOTTOM,
  };
  let pointArray = [];
  let fromPt = new Point(sourcePoint.pos[0], sourcePoint.pos[1]);
  let toPt = new Point(targetPoint.pos[0], targetPoint.pos[1]);
  let fromDir = _oriMap[sourcePoint.orientation.toString()];
  let toDir = _oriMap[targetPoint.orientation.toString()];
  
  route(pointArray, fromPt, fromDir, toPt, toDir, obstacleMap, 1);

  // 避障失败
  if (pointArray.length === 0 || pointArray.filter((item) => !item).length > 0) {
    pointArray = [];
    _route(pointArray, fromPt, fromDir, toPt, toDir);
  } else {
    // 去除重复节点
    pointArray = _.uniqWith(pointArray, _.isEqual);

    // 动态规划，合并线段，优化避障
    pointArray = mergePoint(pointArray, obstacleMap);
  }


  // 寻找start、end的网格节点
  // let startPoint = [obstacleMap.round(sourcePoint.pos[0]), obstacleMap.round(sourcePoint.pos[1])];
  // let endPoint = [obstacleMap.round(targetPoint.pos[0]), obstacleMap.round(targetPoint.pos[1])];

  // 按照方向偏移一格
  // startPoint = orientationOffet(startPoint, sourcePoint.orientation, obstacleMap.options.girdGap);
  // endPoint = orientationOffet(endPoint, targetPoint.orientation, obstacleMap.options.girdGap);



  // console.log(startPoint);
  // console.log(endPoint);
  console.log(pointArray);

  if (options.hasRadius) {
    if (pointArray.length < 3) {
      return {
        path: getDefaultPath(pointArray),
        breakPoints: pointArray
      };
    }

    return getRadiusPath(pointArray)
  }
  else {
    return {
      path: getDefaultPath(pointArray),
      breakPoints: pointArray
    };
  }
}

export default drawAdvancedManhattan;