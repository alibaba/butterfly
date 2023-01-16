'use strict';

import { options } from 'less';
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

var Rect = function(x, y, w, h) {

  if (!(this instanceof Rect)) {
      return new Rect(x, y, w, h);
  }

  if ((Object(x) === x)) {
      y = x.y;
      w = x.width;
      h = x.height;
      x = x.x;
  }

  this.x = x === undefined ? 0 : x;
  this.y = y === undefined ? 0 : y;
  this.width = w === undefined ? 0 : w;
  this.height = h === undefined ? 0 : h;
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
  // console.log(rectLines)
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
  obj.width = 110; // 先写死
  obj.height = 65;
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

  // Builds a map of all elements for quicker obstacle queries (i.e. is a point contained
  // in any obstacle?) (a simplified grid search).
  // The paper is divided into smaller cells, where each holds information about which
  // elements belong to it. When we query whether a point lies inside an obstacle we
  // don't need to go through all obstacles, we check only those in a particular cell.
  var mapGridSize = this.mapGridSize;
  pointArr.reduce(function(map, element) {

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

// get grid size in x and y dimensions, adapted to source and target positions
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

// fix direction offsets according to current grid
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

  // Invert the y-axis.
  var y = -(p.y - data.y);
  var x = p.x - data.x;
  var rad = Math.atan2(y, x); // defined for all 0 corner cases

  // Correction for III. and IV. quadrant.
  if (rad < 0) {
      rad = 2 * Math.PI + rad;
  }
  return 180 * rad / Math.PI;
}

// returns a direction index from start point to end point
// corrects for grid deformation between start and end
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

// return a normalized vector from given point
// used to determine the direction of a difference of two points
function normalizePoint(point) {

  return new Point(
      point.x === 0 ? 0 : Math.abs(point.x) / point.x,
      point.y === 0 ? 0 : Math.abs(point.y) / point.y
  );
}

// reconstructs a route by concatenating points with their parents
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
    console.log(route, 'route');
    return route;
}


// find points around the bbox taking given directions into account
// lines are drawn from anchor in given directions, intersections recorded
// if anchor is outside bbox, only those directions that intersect get a rect point
// the anchor itself is returned as rect point (representing some directions)
// (since those directions are unobstructed by the bbox)
function getRectPoints(anchor, bbox, directionList, grid, opt) {
  var precision = opt.precision;
  var directionMap = opt.directionMap;
  // let _bbox = new Point(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
  // var anchorCenterVector = difference(_bbox, anchor);
  let anchorCenterVector = new Point(0,0)
  var keys = _.isObject(directionMap) ? Object.keys(directionMap) : [];
  var dirList = _.toArray(directionList);
  var rectPoints = keys.reduce(function(res, key) {
    
    if (dirList.includes(key)) {
      var direction = directionMap[key];
      
      // create a line that is guaranteed to intersect the bbox if bbox is in the direction
      // even if anchor lies outside of bbox
      let _anchor = new Point(anchor.x, anchor.y)
      var endpoint = new Point(
        anchor.x + direction.x * (Math.abs(anchorCenterVector.x) + bbox.width),
        anchor.y + direction.y * (Math.abs(anchorCenterVector.y) + bbox.height)
        );
        var intersectionLine = new Line(_anchor, endpoint)
        // console.log(intersectionLine, bbox)
          // get the farther intersection, in case there are two
          // (that happens if anchor lies next to bbox)
          var intersections = intersectionLine.intersect(bbox) || []
          // console.log(intersections, 'intersections')
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

          // if an intersection was found in this direction, it is our rectPoint
          if (farthestIntersection) {
              var point = align(farthestIntersection, grid, precision);
              // if the rectPoint lies inside the bbox, offset it by one more step
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

// return the change in direction between two direction angles
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

// finds the route between two points/rectangles (`from`, `to`) implementing A* algorithm
// rectangles get rect points assigned by getRectPoints()
function findRoute(from, to, isPointObstacle, opt, sourcePoint) {
  var precision = opt.precision;
  

  // Get grid for this route.

  var sourceAnchor, targetAnchor;

  sourceAnchor = round(getSourceAnchor(from, opt), precision);
  opt.sourceAnchor = sourceAnchor;
  targetAnchor = round( getTargetAnchor(to, opt), precision);
  opt.targetAnchor = targetAnchor;
  // sourceAnchor = {x: 120, y: 85}
  // targetAnchor = {x: 870, y: 485}
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

  // Check that there is an accessible route point on both sides.
  // Otherwise, use fallbackRoute()
  // console.log(startPoints, endPoints);
  if (startPoints.length > 0 && endPoints.length > 0) {

      // The set of tentative points to be evaluated, initially containing the start points.
      // Rounded to nearest integer for simplicity.
      var openSet = new SortedSet();
      // Keeps reference to actual points for given elements of the open set.
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
      var previousRouteDirectionAngle = opt.previousDirectionAngle; // undefined for first route
      var isPathBeginning = (previousRouteDirectionAngle === undefined);

      // directions
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

      // main route finding loop
      var loopsRemaining = opt.maximumLoops;
      while (!openSet.isEmpty() && loopsRemaining > 0) {
        // remove current from the open list
        var currentKey = openSet.pop();
        // let currentKey = sourcePoint.pos[0] + '@' + sourcePoint.pos[1]
        var currentPoint = points[currentKey];
        var currentParent = parents[currentKey];
        var currentCost = costs[currentKey];
        
        var isRouteBeginning = (currentParent === undefined); // undefined for route starts
        // console.log(start, currentPoint, 'ssss')
        var isStart = equals(start, currentPoint); // (is source anchor or `from` point) = can leave in any direction
        // console.log(isRouteBeginning, isPathBeginning, isStart)
          var previousDirectionAngle;
          if (!isRouteBeginning) previousDirectionAngle = getDirectionAngle(currentParent, currentPoint, numDirections, grid, opt); // a vertex on the route
          else if (!isPathBeginning) previousDirectionAngle = previousRouteDirectionAngle; // beginning of route on the path
          else if (!isStart) previousDirectionAngle = getDirectionAngle(start, currentPoint, numDirections, grid, opt); // beginning of path, start rect point
          else previousDirectionAngle = null; // beginning of path, source anchor or `from` point

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
          // console.log(endPointsKeys, currentKey)
          if (!skipEndCheck && (endPointsKeys.indexOf(currentKey) >= 0)) {
              opt.previousDirectionAngle = previousDirectionAngle;
              return reconstructRoute(parents, points, currentPoint, start, end, grid, opt);
          }

          // go over all possible directions and find neighbors
          for (i = 0; i < numDirections; i++) {
              direction = directions[i];

              var directionAngle = direction.angle;
              directionChange = getDirectionChange(previousDirectionAngle, directionAngle);

              // if the direction changed rapidly, don't use this point
              // any direction is allowed for starting points
              if (!(isPathBeginning && isStart) && directionChange > opt.maxAllowedDirectionChange) continue;
              let _currentPoint = new Point(currentPoint.x, currentPoint.y);
              var neighborPoint = align(offset(direction.gridOffsetX, direction.gridOffsetY, _currentPoint), grid, precision);
              var neighborKey = getKey(neighborPoint);

              // Closed points from the openSet were already evaluated.
              if (openSet.isClose(neighborKey) || isPointObstacle(neighborPoint)) continue;

              // We can only enter end points at an acceptable angle.
              if (endPointsKeys.indexOf(neighborKey) >= 0) { // neighbor is an end point

                  var isNeighborEnd = equals(end, neighborPoint); // (is target anchor or `to` point) = can be entered in any direction

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

  // no route found (`to` point either wasn't accessible or finding route took
  // way too much calculation)
  // return _route(pointArr, fromPt, orientation[sourcePoint.orientation.join('')], toPt, orientation[targetPoint.orientation.join('')]);
  return null;
  // return opt.fallbackRoute.call(this, start, end, opt);
}

var normalizeAngle = function(angle) {
  return (angle % 360) + (angle < 0 ? 360 : 0);
};

// resolve some of the options
function resolveOptions(opt) {
    opt.directions = _.result(opt, 'directions');
    opt.penalties = _.result(opt, 'penalties');
    opt.paddingBox = _.result(opt, 'paddingBox');
    opt.padding = _.result(opt, 'padding');

    if (opt.padding) {
        // if both provided, opt.padding wins over opt.paddingBox
        var sides = util.normalizeSides(opt.padding);
       
    }

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
    const fromPt = {
      x: 80,
      y: 10,
      width: 160,
      height: 90
    };
    const toPt = {
      x: 790,
      y: 440,
      width: 160,
      height: 90
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