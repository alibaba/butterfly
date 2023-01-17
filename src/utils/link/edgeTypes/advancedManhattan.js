'use strict';

import {getAvoidObstaclesInfo, _calcOrientation, _route, LEFT, RIGHT, TOP, BOTTOM, DEFAULT_RADIUS, Point } from './_utils';
import _ from 'lodash';
const sortedIndex = _.sortedIndexBy || _.sortedIndex;
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

const Line = function(p1, p2) {
  if (!(this instanceof Line)) {
      return new Line(p1, p2);
  }

  if (p1 instanceof Line) {
      return new Line(p1.start, p1.end);
  }

  this.start = new Point(p1.x, p1.y);
  this.end = new Point(p2.x, p2.y);
};

Line.prototype = {
  intersect: function(shape) {
     // this bbox
			// line intersectionLine
    if (shape) {
        var intersection = _intersectionWithLine(this, shape);
        if (intersection && (shape instanceof Line)) {
          intersection = intersection[0];
        }
        return intersection;
    }

    return null;
  },
}

function intersectionWithLine (line, data) {
  var pt1Dir = new Point(data.end.x - data.start.x, data.end.y - data.start.y);
  var pt2Dir = new Point(line.end.x - line.start.x, line.end.y - line.start.y);
  var det = (pt1Dir.x * pt2Dir.y) - (pt1Dir.y * pt2Dir.x);
  var deltaPt = new Point(line.start.x - data.start.x, line.start.y - data.start.y);
  var alpha = (deltaPt.x * pt2Dir.y) - (deltaPt.y * pt2Dir.x);
  var beta = (deltaPt.x * pt1Dir.y) - (deltaPt.y * pt1Dir.x);

  if (det === 0 || alpha * det < 0 || beta * det < 0) {
      // No intersection found.
      return null;
  }

  if (det > 0) {
      if (alpha > det || beta > det) {
          return null;
      }

  } else {
      if (alpha < det || beta < det) {
          return null;
      }
  }
  return new Point(
      data.start.x + (alpha * pt1Dir.x / det),
      data.start.y + (alpha * pt1Dir.y / det)
  );
}

function topLeft (r) {

  return new Point(r.x, r.y);
}

function topRight (r) {

  return new Point(r.x + r.width, r.y);
}

function bottomRight (r) {

  return new Point(r.x + r.width, r.y + r.height);
}

function bottomLeft (r) {

  return new Point(r.x, r.y + r.height);
}

const topLine = (r) => {
  return new Line(topLeft(r), topRight(r));
}

const rightLine = (r) => {
  return new Line(topRight(r), bottomRight(r));
}
const bottomLine = (r) => {
  return new Line(bottomLeft(r), bottomRight(r));
}

const leftLine = (r) => {
  return new Line(topLeft(r), bottomLeft(r));
}

function _intersectionWithLine (line, shape) {
  var r = shape;
  var rectLines = [topLine(r), rightLine(r), bottomLine(r), leftLine(r)];
  var points = [];
  var dedupeArr = [];
  var pt, i;
  var n = rectLines.length;
  for (i = 0; i < n; i++) {

      pt = intersectionWithLine(rectLines[i], line);
      let _pt = pt && pt.x + '@' + pt.y
      if (pt !== null && dedupeArr.indexOf(_pt) < 0) {
          points.push(pt);
          dedupeArr.push(_pt);
      }
  }
  return points.length > 0 ? points : null;
}

// Sorted Set
// Set of items sorted by given value.
function SortedSet() {
  this.items = [];
  this.hash = {};
  this.values = {};
  this.OPEN = 1;
  this.CLOSE = 2;
}

SortedSet.prototype.add = function(item, value) {

if (this.hash[item]) {
    // item removal
    this.items.splice(this.items.indexOf(item), 1);
} else {
    this.hash[item] = this.OPEN;
}

this.values[item] = value;

var index = sortedIndex(this.items, item, function(i) {
    return this.values[i];
}.bind(this));
this.items.splice(index, 0, item);
};

SortedSet.prototype.remove = function(item) {

this.hash[item] = this.CLOSE;
};

SortedSet.prototype.isOpen = function(item) {

return this.hash[item] === this.OPEN;
};

SortedSet.prototype.isClose = function(item) {

return this.hash[item] === this.CLOSE;
};

SortedSet.prototype.isEmpty = function() {

return this.items.length === 0;
};

SortedSet.prototype.pop = function() {

var item = this.items.shift();
this.remove(item);
return item;
};

const moveAndExpand = (obj,r) => {
  obj.width = obj.width || 150;
  obj.height = obj.height || 65;
  obj.x += r.x || 0;
  obj.y += r.y || 0;
  obj.width += r.width || 0;
  obj.height += r.height || 0;
  return obj;
}

const snapToGrid = (gridSize, type, data) => {
  let bbox;
  if (type === 'origin') {
    bbox = new Point(data.x, data.y);
  } else if (type === 'corner') {
    bbox = new Point(data.x + data.width, data.y + data.height);
  } else if (type === 'clone') {
    bbox = new Point(data.x, data.y);
  }

  bbox.x = gridSize * Math.round(bbox.x / gridSize);
  bbox.y = gridSize * Math.round(bbox.y / gridSize);
  return bbox

}

const containsPoint = (p, data) => {
  p = new Point(p.x, p.y);
  return p.x >= data.x && p.x <= data.x + data.width && p.y >= data.y && p.y <= data.y + data.height;
}

function ObstacleMap(opt) {

  this.map = {};
  this.options = opt;
  // tells how to divide the paper when creating the elements map
  this.mapGridSize = 100;
}


ObstacleMap.prototype.build = function(pointArr, link) {

  var opt = this.options;

  // Exclude any embedded elements from the source and the target element.
  var excludedAncestors = [];

// 构建所有元素的地图，以便更快地查询障碍物（即是否包含一个点
// 在任何障碍物中？）（简化的网格搜索）。
// 论文被分成更小的单元格，每个单元格都包含关于哪个单元格的信息
// 元素属于它。当我们查询一个点是否位于障碍物内时，我们
// 不需要通过所有障碍，我们只检查特定单元格中的障碍。
  var mapGridSize = this.mapGridSize;
  pointArr.reduce(function(map, element) {
      element.x = element.left;
      element.y = element.top;
      var isExcluded = false;
      if (!isExcluded) {
        var bbox = moveAndExpand(element, opt.paddingBox);
        var origin = snapToGrid(mapGridSize, 'origin', bbox);
        var corner = snapToGrid(mapGridSize, 'corner', bbox);
        for (var x = origin.x; x <= corner.x; x += mapGridSize) {
            for (var y = origin.y; y <= corner.y; y += mapGridSize) {
                var gridKey = x + '@' + y;
                map[gridKey] = map[gridKey] || [];
                map[gridKey].push(bbox);
            }
        }
      }

      return map;
  }, this.map);
  return this;
};

ObstacleMap.prototype.isPointAccessible = function(point) {
  var mapData = snapToGrid(this.mapGridSize, 'clone', point);
  var mapKey = mapData.x + '@' + mapData.y
  return _.toArray(this.map[mapKey]).every(function(obstacle) {
    obstacle.containsPoint = containsPoint
    return !obstacle.containsPoint(point, obstacle)
  });
};
 
 const round = (data, precision) => {
  var f = 1; // case 0
  if (precision) {
      switch (precision) {
          case 1: f = 10; break;
          case 2: f = 100; break;
          case 3: f = 1000; break;
          default: f = pow(10, precision); break;
      }
  }
  if (data && data instanceof Point) {
    data.x = Math.round(data.x * f) / f;
    data.y = Math.round(data.y * f) / f;
  }
  return data;
}

const snapToGrid1 = (value, gridSize) => {

  return gridSize * round(value / gridSize);
};

function _snapToGrid(point, grid) {

  var source = grid.source;

  var snappedX = snapToGrid1(point.x - source.x, grid.x) + source.x;
  var snappedY = snapToGrid1(point.y - source.y, grid.y) + source.y;
  return new Point(snappedX, snappedY);
}
// snap to grid and then round the point
function align(point, grid, precision) {
  return round(_snapToGrid(point, grid), precision);
}

// 获取 x 和 y 维度的网格大小，source和target位置
function getGrid(step, source, target) {
  return {
      source: source,
      x: getGridDimension(target.x - source.x, step),
      y: getGridDimension(target.y - source.y, step)
  };
}

// helper function for getGrid()
function getGridDimension(diff, step) {

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

const difference = (dxx, data) => {
  let dy, dx;
  if ((Object(dxx) === dxx)) {
    dy = dxx.y;
    dx = dxx.x;
  }
  return new Point(data.x - (dx || 0), data.y - (dy || 0));
}

const squaredLength = function(start, end) {

  var x0 = start.x;
  var y0 = start.y;
  var x1 = end.x;
  var y1 = end.y;
  return (x0 -= x1) * x0 + (y0 -= y1) * y0;
};

// 根据当前网格固定方向偏移
function getGridOffsets(directions, grid, opt) {

  var step = opt.step || 10;

  return directions.map((direction) => {

      direction.gridOffsetX = (direction.offsetX / step) * grid.x;
      direction.gridOffsetY = (direction.offsetY / step) * grid.y;
      return direction
  });
  
}

function estimateCost(from, endPoints) {

  var min = Infinity;
  for (var i = 0, len = endPoints.length; i < len; i++) {
    var cost =  Math.abs(endPoints[i].x - from.x) + Math.abs(endPoints[i].y - from.y);
    if (cost < min) min = cost;
  }
  return min;
}

function theta (p, data) {
  p = new Point(p.x, p.y);

 // 反转 y 轴。
 var y = -(p.y - data.y);
  var x = p.x - data.x;
  var rad = Math.atan2(y, x); // 为所有 0 角情况定义

  // Correction for III. and IV. quadrant.
  if (rad < 0) {
      rad = 2 * Math.PI + rad;
  }
  return 180 * rad / Math.PI;
}

// 返回从起点到终点的方向索引
// 更正开始和结束之间的网格变形
function getDirectionAngle(start, end, numDirections, grid, opt) {
  var quadrant = 360 / numDirections;
  var angleTheta = theta(fixAngleEnd(start, end, grid, opt), start);
  let angle = angleTheta + (quadrant / 2)
  var normalizedAngle = (angle % 360) + (angle < 0 ? 360 : 0);
  return quadrant * Math.floor(normalizedAngle / quadrant);
}

function fixAngleEnd(start, end, grid, opt) {

  var step = opt.step;

  var diffX = end.x - start.x;
  var diffY = end.y - start.y;

  var gridStepsX = diffX / grid.x;
  var gridStepsY = diffY / grid.y;

  var distanceX = gridStepsX * step;
  var distanceY = gridStepsY * step;

  return new Point(start.x + distanceX, start.y + distanceY);
}

// 从给定点返回归一化向量
// 用于判断两点之差的方向
function normalizePoint(point) {

  return new Point(
      point.x === 0 ? 0 : Math.abs(point.x) / point.x,
      point.y === 0 ? 0 : Math.abs(point.y) / point.y
  );
}

// 通过将点与其父母连接来重建路线
// 核心代码 重新计算路线点
function reconstructRoute(parents, points, tailPoint, from, to, grid, opt) {

    var route = [];

    var prevDiff = normalizePoint(difference(tailPoint, to));

    // tailPoint is assumed to be aligned already
    var currentKey = getKey(tailPoint);
    var parent = parents[currentKey];

    var point;
    while (parent) {

        // point is assumed to be aligned already
        point = points[currentKey];

        var diff = normalizePoint(difference(parent, point));
        if (!equals(prevDiff, diff)) {
            route.unshift(point);
            prevDiff = diff;
        }

        // parent is assumed to be aligned already
        currentKey = getKey(parent);
        parent = parents[currentKey];
    }

    // leadPoint is assumed to be aligned already
    var leadPoint = points[currentKey];

    var fromDiff = normalizePoint(_.difference(from));
    if (!equals(prevDiff, fromDiff)) {
        route.unshift(leadPoint);
    }
    return route;
}


// 考虑到给定的方向，找到 bbox 周围的点
// 从给定方向的锚点绘制线，记录交叉点
// 如果 anchor 在 bbox 之外，只有那些相交的方向才能得到一个直角点
// 锚点本身作为矩形点返回（代表一些方向）
// （因为这些方向不受 bbox 的阻碍）
function getRectPoints(anchor, bbox, directionList, grid, opt) {
  var precision = opt.precision;
  var directionMap = opt.directionMap;
  let anchorCenterVector = new Point(0,0)
  var keys = _.isObject(directionMap) ? Object.keys(directionMap) : [];
  var dirList = _.toArray(directionList);
  var rectPoints = keys.reduce(function(res, key) {
    
    if (dirList.includes(key)) {
      var direction = directionMap[key];
      
      // 如果 bbox 在方向上，则创建一条保证与 bbox 相交的线
      // 即使锚位于 bbox 之外
      let _anchor = new Point(anchor.x, anchor.y)
      var endpoint = new Point(
        anchor.x + direction.x * (Math.abs(anchorCenterVector.x) + bbox.width),
        anchor.y + direction.y * (Math.abs(anchorCenterVector.y) + bbox.height)
        );
        var intersectionLine = new Line(_anchor, endpoint)
          // 获得更远的路口，以防有两个
          // （如果锚点位于 bbox 旁边，就会发生这种情况
          var intersections = intersectionLine.intersect(bbox) || []
          var numIntersections = intersections.length;
          var farthestIntersectionDistance;
          var farthestIntersection = null;
          for (var i = 0; i < numIntersections; i++) {
              var currentIntersection = intersections[i];
              var distance = squaredLength(bbox, currentIntersection);
              if ((farthestIntersectionDistance === undefined) || (distance > farthestIntersectionDistance)) {
                  farthestIntersectionDistance = distance;
                  farthestIntersection = currentIntersection;
              }
          }

        // 如果在这个方向上发现了交叉点

          if (farthestIntersection) {
              var point = align(farthestIntersection, grid, precision);
              // 如果当前位置位于 bbox 内，重新计算偏移量
              if (containsPoint(point, bbox)) {
                  point = align(offset(direction.x * grid.x, direction.y * grid.y, point), grid, precision);
              }

              // then add the point to the result array
              // aligned
              res.push(point);
          }
      }

      return res;
  }, []);

  // if anchor lies outside of bbox, add it to the array of points
  if (!containsPoint(anchor, bbox)) {
      // aligned
      rectPoints.push(align(anchor, grid, precision));
  }
  return rectPoints;
}

function getKey(point) {
  
  return point.x + '@' + point.y;
}

function equals(p, data) {
  return !!p &&
  data.x === p.x &&
  data.y === p.y;
}

// 返回两个方向角之间的方向变化
function getDirectionChange(angle1, angle2) {

  var directionChange = Math.abs(angle1 - angle2);
  return (directionChange > 180) ? (360 - directionChange) : directionChange;
}

function offset (dx, dy, data) {

  if ((Object(dx) === dx)) {
      dy = dx.y;
      dx = dx.x;
  }

  data.x += dx || 0;
  data.y += dy || 0;
  return data;
}
// return source bbox
function getSourceBBox(linkView, opt) {

  // expand by padding box
  
  if (opt && opt.paddingBox) { return moveAndExpand(linkView, opt.paddingBox); }

  return linkView;
}

// return target bbox
function getTargetBBox(linkView, opt) {

  // expand by padding box
  if (opt && opt.paddingBox) { return moveAndExpand(linkView, opt.paddingBox); }

  return linkView;
}

function center (data) {

  return new Point(data.x + data.width / 2, data.y + data.height / 2);
}

// return source anchor
function getSourceAnchor(linkView, opt) {
  if (opt.sourceAnchor) { return linkView.sourceAnchor; }

  // fallback: center of bbox

  var sourceBBox = getSourceBBox(linkView, opt);
  return center(sourceBBox);
}

// // return target anchor
function getTargetAnchor(linkView, opt) {

  if (opt.targetAnchor) { return linkView.targetAnchor; }

  // fallback: center of bbox
  var targetBBox = getTargetBBox(linkView, opt);
  return center(targetBBox); // default
}

// 找到实现 A*算法的两个点/矩形（`from`、`to`）之间的路线
// 矩形得到由 getRectPoints() 分配的矩形点
function findRoute(from, to, isPointObstacle, opt, sourcePoint) {
  var precision = opt.precision;
  

 // 获取这条路线的网格

  var sourceAnchor, targetAnchor;

  sourceAnchor = round(getSourceAnchor(from, opt), precision);
  opt.sourceAnchor = sourceAnchor;
  targetAnchor = round( getTargetAnchor(to, opt), precision);
  opt.targetAnchor = targetAnchor;
  // 获取 x 和 y 维度的网格大小，源和目标
  var grid = getGrid(opt.step, sourceAnchor, targetAnchor);
  // Get pathfinding points. 获取路径点
  var start, end; // aligned with grid by definition 根据定义与网格对齐
  var startPoints, endPoints; // assumed to be aligned with grid already 假定已经与网格对齐

    // set of points we start pathfinding from 开始找一组点
      start = sourceAnchor;
      startPoints = getRectPoints(start, from, opt.startDirections, grid, opt);


  // set of points we want the pathfinding to finish at 结束一组点
      end = targetAnchor;
      endPoints = getRectPoints(targetAnchor, to, opt.endDirections, grid, opt);
  // take into account only accessible rect points (those not under obstacles) // 确定不再障碍物下的点 在的话不考虑

  startPoints = startPoints.filter(p => !isPointObstacle(p));
  endPoints = endPoints.filter(p => !isPointObstacle(p));

  // 检查两侧是否有可到达的路线点。
 // 否则，使用不返回任何数据点 依旧用曼哈顿的逻辑
  if (startPoints.length > 0 && endPoints.length > 0) {

      // 要评估的暂定点集，最初包含起点。
     // 为简单起见四舍五入到最接近的整数。
      var openSet = new SortedSet();
      // 保持对开放集中给定元素的实际点的引用。
      var points = {};
      // Keeps reference to a point that is immediate predecessor of given element.
      var parents = {};
      // Cost from start to a point along best known path.
      var costs = {};

      for (var i = 0, n = startPoints.length; i < n; i++) {
          // startPoint is assumed to be aligned already
          var startPoint = startPoints[i];
          var key = `${startPoint.x}@${startPoint.y}`;
          openSet.add(key, estimateCost(startPoint, endPoints));
          points[key] = startPoint;
          costs[key] = 0;
        }
      var previousRouteDirectionAngle = opt.previousDirectionAngle; // 路线没有定义的话 就是null
      var isPathBeginning = (previousRouteDirectionAngle === undefined);

      // 确定方向
      var direction, directionChange;
      var directions = opt.directions;
      directions = getGridOffsets(directions, grid, opt); // 获取网格偏移
      var numDirections = directions.length;

      var endPointsKeys = _.toArray(endPoints).reduce(function(res, endPoint) {
          // endPoint is assumed to be aligned already

          var key = `${endPoint.x}@${endPoint.y}`;
          
          res.push(key);
          return res;
      }, []);

      // main route finding loop 主路径查找循环
      var loopsRemaining = opt.maximumLoops;
      while (!openSet.isEmpty() && loopsRemaining > 0) {
        // 删除当前拖拽的节点
        var currentKey = openSet.pop();
        var currentPoint = points[currentKey];
        var currentParent = parents[currentKey];
        var currentCost = costs[currentKey];
        
        var isRouteBeginning = (currentParent === undefined); // undefined for route starts 未定义路线起点
        var isStart = equals(start, currentPoint); // 如果是源锚点或“起始点”  可以向任何方向离开
          var previousDirectionAngle;
          if (!isRouteBeginning) previousDirectionAngle = getDirectionAngle(currentParent, currentPoint, numDirections, grid, opt); // 路线上的一个顶点
          else if (!isPathBeginning) previousDirectionAngle = previousRouteDirectionAngle; // 路线的起点
          else if (!isStart) previousDirectionAngle = getDirectionAngle(start, currentPoint, numDirections, grid, opt); // 路径的开始，开始矩形点
          else previousDirectionAngle = null; // beginning of path, source anchor or `from` point 路径的起点、源锚点或“起始点”

          // check if we reached any endpoint
          var samePoints = startPoints.length === endPoints.length;
          if (samePoints) {
              for (var j = 0; j < startPoints.length; j++) {
                  if (!equals(endPoints[j], startPoints[j])) {
                      samePoints = false;
                      break;
                  }
              }
          }
          var skipEndCheck = (isRouteBeginning && samePoints);
          // 满足条件开始计算新节点
          if (!skipEndCheck && (endPointsKeys.indexOf(currentKey) >= 0)) {
              opt.previousDirectionAngle = previousDirectionAngle;
              return reconstructRoute(parents, points, currentPoint, start, end, grid, opt);
          }

          // 遍历所有可能的方向并找到邻居
          for (i = 0; i < numDirections; i++) {
              direction = directions[i];

              var directionAngle = direction.angle;
              directionChange = getDirectionChange(previousDirectionAngle, directionAngle);

              // 如果方向变化很快，不要用这个点
              // 起点可以任意方向 
              if (!(isPathBeginning && isStart) && directionChange > opt.maxAllowedDirectionChange) continue;
              let _currentPoint = new Point(currentPoint.x, currentPoint.y);
              var neighborPoint = align(offset(direction.gridOffsetX, direction.gridOffsetY, _currentPoint), grid, precision);
              var neighborKey = getKey(neighborPoint);

              // Closed points from the openSet were already evaluated.来自 openSet 的闭合点已经被评估。
              if (openSet.isClose(neighborKey) || isPointObstacle(neighborPoint)) continue;

              // We can only enter end points at an acceptable angle. // 我们只能以可接受的角度输入端点。
              if (endPointsKeys.indexOf(neighborKey) >= 0) { // neighbor is an end point

                  var isNeighborEnd = equals(end, neighborPoint); // (is target anchor or `to` point) = 可以在任何方向输入

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
                  // 最终完成openSet中的数据 用于计算节点
                  openSet.add(neighborKey, costFromStart + estimateCost(neighborPoint, endPoints));
              }
          }

          loopsRemaining--;
      }
  }

  // no route found (`to` point either wasn't accessible or finding route took
  // way too much calculation)
  return null;
}

var normalizeAngle = function(angle) {
  return (angle % 360) + (angle < 0 ? 360 : 0);
};

// 初始化options 
function resolveOptions(opt) {
    opt.directions = _.result(opt, 'directions');
    opt.penalties = _.result(opt, 'penalties');
    opt.paddingBox = _.result(opt, 'paddingBox');
    opt.padding = _.result(opt, 'padding');

    if (opt.padding) {
        // if both provided, opt.padding wins over opt.paddingBox
        var sides = util.normalizeSides(opt.padding);
       
    }
    // 这里的数据后续用得到
    _.toArray(opt.directions).forEach(function(direction) {

        var point1 = new Point(0, 0);
        var point2 = new Point(direction.offsetX, direction.offsetY);
        direction.angle = normalizeAngle(theta(point2, point1));
    });
}


function drawAdvancedManhattan(sourcePoint, targetPoint, options) {

  //sourcePoint、targetPoint就是开始、结束坐标
  // 画布所有节点、线段数据
  let canvasData = getAvoidObstaclesInfo();
  resolveOptions(options); 
  // 迁移逻辑
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
      y: sourcePoint.pos[1]
    };
    const toPt = {
      x: targetPoint.pos[0],
      y: targetPoint.pos[1]
    };
    const orientation = {
      '-10': LEFT,
      '10': RIGHT,
      '0-1': TOP,
      '01': BOTTOM,
    };
    _route(pointArr, fromPt, orientation[sourcePoint.orientation.join('')], toPt, orientation[targetPoint.orientation.join('')]);
    let isPointObstacle;
    if (typeof options.isPointObstacle === 'function') {
        isPointObstacle = options.isPointObstacle;
    } else {
        const map = new ObstacleMap(options); // 判断是否需要蔽障 有2个方法
        map.build(canvasData.nodes);
        isPointObstacle = (point) => !map.isPointAccessible(point);
    }
      const _point = findRoute( fromPt, toPt, isPointObstacle, options, sourcePoint)
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