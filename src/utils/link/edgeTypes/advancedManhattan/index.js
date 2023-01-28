'use strict';

import _ from 'lodash';
import {getAvoidObstaclesInfo, _calcOrientation, _route, LEFT, RIGHT, TOP, BOTTOM, DEFAULT_RADIUS } from '../_utils';
import Point from './point';
import Line from './line';
import ObstacleMap from './obstacleMap';
import SortedSet from './sortedSet';

// 生成path方法
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


const normalizeAngle = (angle) => {
  return (angle % 360) + (angle < 0 ? 360 : 0);
};

const snapToGrid = (v, g) => {
  return g * Math.round(v / g);
}

function _snapToGrid(point, grid) {

  let source = grid.source;

  let snappedX = snapToGrid(point.x - source.x, grid.x) + source.x;
  let snappedY = snapToGrid(point.y - source.y, grid.y) + source.y;
  return new Point(snappedX, snappedY);
}

function align(point, grid, precision) {
  return _snapToGrid(point, grid).round(precision);
}

const containsPoint = (p, data) => {
  p = new Point(p.x, p.y);
  return p.x >= data.x && p.x <= data.x + data.width && p.y >= data.y && p.y <= data.y + data.height;
}

const getRectPoints = (point, node, directionList, grid, opt) => {

  let precision = opt.precision;
  let directionMap = opt.directionMap;
  
  let anchorCenterVector = point.difference(node.x + node.w / 2, node.y + node.h / 2);

  let keys = _.isObject(directionMap) ? Object.keys(directionMap) : [];
  let dirList = _.toArray(directionList);
  let rectPoints = keys.reduce(function(res, key) {
    if (dirList.includes(key)) {
      let direction = directionMap[key];

        let endpoint = new Point(
          point.x + direction.x * (Math.abs(anchorCenterVector.x) + node.w),
          point.y + direction.y * (Math.abs(anchorCenterVector.y) + node.h)
        );

        let intersectionLine = new Line(point, endpoint);

        // get the farther intersection, in case there are two
        // (that happens if anchor lies next to bbox)
        let intersections = intersectionLine.intersect(node) || [];
        let numIntersections = intersections.length;
        let farthestIntersectionDistance;
        let farthestIntersection = null;
        for (let i = 0; i < numIntersections; i++) {
          let currentIntersection = intersections[i];
          let distance = point.squaredDistance(currentIntersection);
          if ((farthestIntersectionDistance === undefined) || (distance > farthestIntersectionDistance)) {
            farthestIntersectionDistance = distance;
            farthestIntersection = currentIntersection;
          }
        }

        // if an intersection was found in this direction, it is our rectPoint
        if (farthestIntersection) {
          let _point = align(farthestIntersection, grid, precision);
          // if the rectPoint lies inside the bbox, offset it by one more step
          if (containsPoint(_point, node)) {
            _point = align(point.offset(direction.x * grid.x, direction.y * grid.y), grid, precision);
          }
          // then add the point to the result array
          // aligned
          res.push(_point);
        }
    }

    return res;
  }, []);

  if (!containsPoint(point, node)) {
    rectPoints.push(align(point, grid, precision));
  }
  return rectPoints;
}

// 初始化options 
const resolveOptions = (opt) => {
  _.toArray(opt.directions).forEach(function(direction) {
    let point1 = new Point(0, 0);
    let point2 = new Point(direction.offsetX, direction.offsetY);
    direction.angle = normalizeAngle(point1.theta(point2));
  });
}

const  getKey = (point) => {
  return point.x + '@' + point.y;
}

const estimateCost = (from, endPoints) => {
  let min = Infinity;
  for (let i = 0, len = endPoints.length; i < len; i++) {
    let cost =  Math.abs(endPoints[i].x - from.x) + Math.abs(endPoints[i].y - from.y);
    if (cost < min) min = cost;
  }
  return min;
}

const getGridOffsets = (directions, grid, opt) => {

  let step = opt.step || 10;

  return directions.map((direction) => {

      direction.gridOffsetX = (direction.offsetX / step) * grid.x;
      direction.gridOffsetY = (direction.offsetY / step) * grid.y;
      return direction
  });
  
}

const fixAngleEnd = (start, end, grid, opt) => {

  let step = opt.step;

  let diffX = end.x - start.x;
  let diffY = end.y - start.y;

  let gridStepsX = diffX / grid.x;
  let gridStepsY = diffY / grid.y;

  let distanceX = gridStepsX * step;
  let distanceY = gridStepsY * step;

  return new Point(start.x + distanceX, start.y + distanceY);
}

const getDirectionAngle = (start, end, numDirections, grid, opt) => {
  let quadrant = 360 / numDirections;
  let angleTheta = start.theta(fixAngleEnd(start, end, grid, opt));
  let angle = angleTheta + (quadrant / 2);
  let normalizedAngle = (angle % 360) + (angle < 0 ? 360 : 0);
  return quadrant * Math.floor(normalizedAngle / quadrant);
}

const normalizePoint = (point) => {

  return new Point(
      point.x === 0 ? 0 : Math.abs(point.x) / point.x,
      point.y === 0 ? 0 : Math.abs(point.y) / point.y
  );
}

const reconstructRoute = (parents, points, tailPoint, from, to, grid, opt) => {

  let route = [];

  let prevDiff = normalizePoint(to.difference(tailPoint));

  // tailPoint is assumed to be aligned already
  let currentKey = getKey(tailPoint);
  let parent = parents[currentKey];

  let point;
  while (parent) {

      // point is assumed to be aligned already
      point = points[currentKey];

      let diff = normalizePoint(point.difference(parent));
      if (!diff.equals(prevDiff)) {
          route.unshift(point);
          prevDiff = diff;
      }

      // parent is assumed to be aligned already
      currentKey = getKey(parent);
      parent = parents[currentKey];
  }

  // leadPoint is assumed to be aligned already
  let leadPoint = points[currentKey];

  let fromDiff = normalizePoint(leadPoint.difference(from));
  if (!fromDiff.equals(prevDiff)) {
      route.unshift(leadPoint);
  }

  return route;
}

const getDirectionChange = (angle1, angle2) => {
  let directionChange = Math.abs(angle1 - angle2);
  return (directionChange > 180) ? (360 - directionChange) : directionChange;
}

// 获取 x 和 y 维度的网格大小，source和target位置
const getGrid = (step, source, target) => {
  return {
      source: source,
      x: getGridDimension(target.x - source.x, step),
      y: getGridDimension(target.y - source.y, step)
  };
}

// helper function for getGrid()
const getGridDimension = (diff, step) => {

  // return step if diff = 0
  if (!diff) return step;

  var absDiff = Math.abs(diff);
  var numSteps = Math.round(absDiff / step);

  // return absDiff if less than one step apart
  if (!numSteps) return absDiff;

  // otherwise, return corrected step
  var roundedDiff = numSteps * step;
  var remainder = absDiff - roundedDiff;
  var stepCorrection = remainder / numSteps;

  return step + stepCorrection;
}

const findRoute = (fromPt, toPt, isPointObstacle, opt) => {

  let sourceNode = new Point(fromPt.nx, fromPt.ny, fromPt.nw, fromPt.nh);
  let targetNode = new Point(toPt.nx, toPt.ny, toPt.nw, toPt.nh);

  let sourceAnchor = new Point(fromPt.x, fromPt.y);
  let targetAnchor = new Point(toPt.x, toPt.y);

  let grid = getGrid(opt.step, sourceAnchor, targetAnchor);

  // Get pathfinding points. 获取路径点
  let start = sourceAnchor, end = targetAnchor; // aligned with grid by definition 根据定义与网格对齐
  let startPoints, endPoints; // assumed to be aligned with grid already 假定已经与网格对齐

  // todo: direction需要修正

  startPoints = getRectPoints(sourceAnchor, sourceNode, opt.startDirections, grid, opt);
  endPoints = getRectPoints(targetAnchor, targetNode, opt.endDirections, grid, opt);

  startPoints = startPoints.filter(p => !isPointObstacle(p));
  endPoints = endPoints.filter(p => !isPointObstacle(p));

  if (startPoints.length > 0 && endPoints.length > 0) {
    let openSet = new SortedSet();
    let points = {};
    let parents = {};
    let costs = {};

    for (let i = 0, n = startPoints.length; i < n; i++) {
      let startPoint = startPoints[i];
      let key = getKey(startPoint);
      openSet.add(key, estimateCost(startPoint, endPoints));
      points[key] = startPoint;
      costs[key] = 0;
    }

    let previousRouteDirectionAngle = opt.previousDirectionAngle; // undefined for first route
    let isPathBeginning = (previousRouteDirectionAngle === undefined);

    // directions
    let direction, directionChange;
    let directions = opt.directions;

    getGridOffsets(directions, grid, opt);

    let precision = opt.precision;

    let numDirections = directions.length;

    let endPointsKeys = _.toArray(endPoints).reduce(function(res, endPoint) {
        let key = getKey(endPoint);
        res.push(key);
        return res;
    }, []);

    let loopsRemaining = opt.maximumLoops;
    while (!openSet.isEmpty() && loopsRemaining > 0) {

      // remove current from the open list
      var currentKey = openSet.pop();
      var currentPoint = points[currentKey];
      var currentParent = parents[currentKey];
      var currentCost = costs[currentKey];

      var isRouteBeginning = (currentParent === undefined); // undefined for route starts
      var isStart = currentPoint.equals(start); // (is source anchor or `from` point) = can leave in any direction

      var previousDirectionAngle;
      if (!isRouteBeginning) previousDirectionAngle = getDirectionAngle(currentParent, currentPoint, numDirections, grid, opt); // a vertex on the route
      else if (!isPathBeginning) previousDirectionAngle = previousRouteDirectionAngle; // beginning of route on the path
      else if (!isStart) previousDirectionAngle = getDirectionAngle(start, currentPoint, numDirections, grid, opt); // beginning of path, start rect point
      else previousDirectionAngle = null; // beginning of path, source anchor or `from` point

      // check if we reached any endpoint
      var samePoints = startPoints.length === endPoints.length;
      if (samePoints) {
        for (var j = 0; j < startPoints.length; j++) {
            if (!startPoints[j].equals(endPoints[j])) {
                samePoints = false;
                break;
            }
        }
      }
      var skipEndCheck = (isRouteBeginning && samePoints);
      if (!skipEndCheck && (endPointsKeys.indexOf(currentKey) >= 0)) {
        opt.previousDirectionAngle = previousDirectionAngle;
        return reconstructRoute(parents, points, currentPoint, start, end, grid, opt);
      }

      // go over all possible directions and find neighbors
      for (let i = 0; i < numDirections; i++) {
        direction = directions[i];

        var directionAngle = direction.angle;
        directionChange = getDirectionChange(previousDirectionAngle, directionAngle);

        // if the direction changed rapidly, don't use this point
        // any direction is allowed for starting points
        if (!(isPathBeginning && isStart) && directionChange > opt.maxAllowedDirectionChange) continue;

        var neighborPoint = align(currentPoint.clone().offset(direction.gridOffsetX, direction.gridOffsetY), grid, precision);
        var neighborKey = getKey(neighborPoint);

        // Closed points from the openSet were already evaluated.
        if (openSet.isClose(neighborKey) || isPointObstacle(neighborPoint)) continue;

        // We can only enter end points at an acceptable angle.
        if (endPointsKeys.indexOf(neighborKey) >= 0) { // neighbor is an end point

          var isNeighborEnd = neighborPoint.equals(end); // (is target anchor or `to` point) = can be entered in any direction

          if (!isNeighborEnd) {
            var endDirectionAngle = getDirectionAngle(neighborPoint, end, numDirections, grid, opt);
            var endDirectionChange = getDirectionChange(directionAngle, endDirectionAngle);

            if (endDirectionChange > opt.maxAllowedDirectionChange) continue;
          }
        }

        // The current direction is ok.

        var neighborCost = direction.cost;
        var neighborPenalty = isStart ? 0 : opt.penalties[directionChange]; // no penalties for start point
        var costFromStart = currentCost + neighborCost + neighborPenalty;

        if (!openSet.isOpen(neighborKey) || (costFromStart < costs[neighborKey])) {
          // neighbor point has not been processed yet
          // or the cost of the path from start is lower than previously calculated

          points[neighborKey] = neighborPoint;
          parents[neighborKey] = currentPoint;
          costs[neighborKey] = costFromStart;
          openSet.add(neighborKey, costFromStart + estimateCost(neighborPoint, endPoints));
        }
      }

      loopsRemaining--;
    }
  }
}


function drawAdvancedManhattan(sourcePoint, targetPoint, options) {

  //sourcePoint、targetPoint就是开始、结束坐标
  // 画布所有节点、线段数据
  let canvasData = getAvoidObstaclesInfo();
  resolveOptions(options); 
  // 迁移逻辑

  if (!sourcePoint.orientation) {
    sourcePoint.orientation = _calcOrientation(targetPoint.pos[0], targetPoint.pos[1], sourcePoint.pos[0], sourcePoint.pos[1]);
  }

  if (!targetPoint.orientation) {
    targetPoint.orientation = _calcOrientation(sourcePoint.pos[0], sourcePoint.pos[1], targetPoint.pos[0], targetPoint.pos[1]);
  }

  const pointArr = [];
  // const fromPt = { // 先写死
  //   x: 80,
  //   y: 10,
  //   width: 160,
  //   height: 90
  // };
  // const toPt = {
  //   x: 790,
  //   y: 440,
  //   width: 160,
  //   height: 90
  // };

  const fromPt = {
    x: sourcePoint.pos[0],
    y: sourcePoint.pos[1],
    nx: sourcePoint.nodePos[0],
    ny: sourcePoint.nodePos[1],
    nw: sourcePoint.nodeSize[0] || 100,
    nh: sourcePoint.nodeSize[1] || 50
  };
  const toPt = {
    x: targetPoint.pos[0],
    y: targetPoint.pos[1],
    nx: targetPoint.nodePos[0],
    ny: targetPoint.nodePos[1],
    nw: targetPoint.nodeSize[0] || 100,
    nh: targetPoint.nodeSize[1] || 50
  };
  const orientation = {
    '-10': LEFT,
    '10': RIGHT,
    '0-1': TOP,
    '01': BOTTOM,
  };
  // 这个确认一下？为啥要用到这个？这个要删除掉
  // _route(pointArr, fromPt, orientation[sourcePoint.orientation.join('')], toPt, orientation[targetPoint.orientation.join('')]);

  let isPointObstacle;
    
  if (typeof options.isPointObstacle === 'function') {
    isPointObstacle = options.isPointObstacle;
  } else {
    const map = new ObstacleMap(options); // 判断是否需要蔽障 有2个方法
    map.build(canvasData.nodes);
    isPointObstacle = (point) => !map.isPointAccessible(point);
  }


  // todo 
  const _point = findRoute(fromPt, toPt, isPointObstacle, options);
  // console.log(_point);
  if (_point) {
    const _data = pointArr.splice(1, pointArr.length - 2);
    pointArr.splice(1, 0 ,..._point)
    console.log(pointArr, _data);
  }
  return {
    path: getDefaultPath(pointArr),
    breakPoints: pointArr
  };
}


export default drawAdvancedManhattan;