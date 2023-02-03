'use strict';

import _ from 'lodash';
import {_calcOrientation, getAvoidObstaclesInfo} from '../_utils'; 
import {Point, _route, getDefaultPath, getRadiusPath, LEFT, RIGHT, TOP, BOTTOM, TOL, TOLxTOL} from './_utils'; 
import ObstacleMap from './obstacleMap';

let MINDIST = 20;

// 寻找两点直线能否合并，无障碍即可合并
const _isMerge = (point1, point2, obstacleMap) => {
  let girdGap = obstacleMap.options.girdGap;
  let info = {
    canMerge: false
  };

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


// 水平、垂直的线段可合并
const _mergeOverlapPoint = (_pointArr) => {
  let tmpPoint2 = _pointArr.map((item) => item);
  let canMerge = true;
  while(canMerge) {
    canMerge = false;

    for(let i = 0; i < tmpPoint2.length - 2; i++) {
      let point1 = {
        x: parseInt(tmpPoint2[i].x),
        y: parseInt(tmpPoint2[i].y),
      }, point2 = {
        x: parseInt(tmpPoint2[i + 1].x),
        y: parseInt(tmpPoint2[i + 1].y)
      }, point3 = {
        x: parseInt(tmpPoint2[i + 2].x),
        y: parseInt(tmpPoint2[i + 2].y)
      };
      if ((point1.x === point2.x && point2.x === point3.x) || (point1.y === point2.y && point2.y === point3.y)) {
        // console.log('-----');
        // console.log(point1);
        // console.log(point2);
        // console.log(point3);
        // console.log(`${(point1[0] === point2[0] && point2[0] === point3[0])} ${point1[1] === point2[1] && point2[1] === point3[1]}`)
        tmpPoint2.splice(i + 1, 1);
        // console.log(JSON.stringify(tmpPoint2));
        canMerge = true;
        break;
      }
    }
  }
  return tmpPoint2;
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

    // 去除重复节点
    pointArray = _.uniqWith(pointArray, _.isEqual);

  } else {
    // 去除重复节点
    pointArray = _.uniqWith(pointArray, _.isEqual);

    // 动态规划，合并线段，优化避障
    pointArray = mergePoint(pointArray, obstacleMap);
  }

  // 合并同一方向的水平、垂直线段
  pointArray = _mergeOverlapPoint(pointArray)

  // 寻找start、end的网格节点
  // let startPoint = [obstacleMap.round(sourcePoint.pos[0]), obstacleMap.round(sourcePoint.pos[1])];
  // let endPoint = [obstacleMap.round(targetPoint.pos[0]), obstacleMap.round(targetPoint.pos[1])];

  // 按照方向偏移一格
  // startPoint = orientationOffet(startPoint, sourcePoint.orientation, obstacleMap.options.girdGap);
  // endPoint = orientationOffet(endPoint, targetPoint.orientation, obstacleMap.options.girdGap);



  // console.log(startPoint);
  // console.log(endPoint);
  // console.log(pointArray);

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