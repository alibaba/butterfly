'use strict';
import _ from 'lodash';

// 获取画布所有属性
let canvas = null;
export function prepareAvoidObstaclesInfo(_canvas) {
  canvas = _canvas;
}
export function getAvoidObstaclesInfo() {
  return {
    nodes: _.get(canvas, 'nodes', []).map((item) => {
      return {
        id: item.id,
        left: item.left,
        top: item.top,
        width: item.width || item.options.width || 100,
        height: item.height || item.options.height || 45
      }
    }),
    edges: _.get(canvas, 'nodes', []).map((item) => item.options)
  }
}

export function _calcOrientation(beginX, beginY, endX, endY, orientationLimit) {

  let _calcWithLimit = (rank) => {
    if (orientationLimit) {
      for (let i = 0; i < rank.length; i++) {
        let isInLimit = _.some(orientationLimit, (limit) => {
          return limit === rank[i];
        });
        if (isInLimit) {
          return rank[i];
        }
      }
      return rank[0];
    } else {
      return rank[0];
    }
  };
  // 计算orientation
  let posX = endX - beginX;
  let posY = endY - beginY;
  let orientation = null;

  // 斜率
  let k = Math.abs(posY / posX);

  if (posX === 0 || posY === 0) {
    if (posX === 0) {
      orientation = posY >= 0 ? _calcWithLimit(['Top', 'Left', 'Right', 'Bottom']) : orientation;
      orientation = posY < 0 ? _calcWithLimit(['Bottom', 'Left', 'Right', 'Top']) : orientation;
    }
    if (posY === 0) {
      orientation = posX >= 0 ? _calcWithLimit(['Right', 'Top', 'Bottom', 'Left']) : orientation;
      orientation = posX < 0 ? _calcWithLimit(['Left', 'Top', 'Bottom', 'Right']) : orientation;
    }
  } else if (posX > 0 && posY > 0) {
    if (k > 1) {
      orientation = _calcWithLimit(['Top', 'Left', 'Right', 'Bottom']);
      // orientation = [0, -1];
    } else {
      orientation = _calcWithLimit(['Left', 'Top', 'Bottom', 'Right']);
      // orientation = [-1, 0];
    }
  } else if (posX < 0 && posY > 0) {
    if (k > 1) {
      orientation = _calcWithLimit(['Top', 'Right', 'Left', 'Bottom']);
      // orientation = [0, -1];
    } else {
      orientation = _calcWithLimit(['Right', 'Top', 'Bottom', 'Left']);
      // orientation = [1, 0];
    }
  } else if (posX < 0 && posY < 0) {
    if (k > 1) {
      orientation = _calcWithLimit(['Bottom', 'Right', 'Left', 'Top']);
      // orientation = [0, 1];
    } else {
      orientation = _calcWithLimit(['Right', 'Bottom', 'Top', 'Left']);
      // orientation = [1, 0];
    }
  } else {
    if (k > 1) {
      orientation = _calcWithLimit(['Bottom', 'Left', 'Right', 'Top']);
      // orientation = [0, 1];
    } else {
      orientation = _calcWithLimit(['Left', 'Bottom', 'Top', 'Right']);
      // orientation = [-1, 0];
    }
  }

  switch (orientation) {
    case 'Left':
      return [-1, 0];
    case 'Right':
      return [1, 0];
    case 'Top':
      return [0, -1];
    case 'Bottom':
      return [0, 1];
  }
}

export function _findControlPoint(point, sourcePoint, targetPoint, _so, _to) {

  // 曲率，可配置的
  let majorAnchor = 10;
  // 偏移，定死的
  let minorAnchor = 10;

  let result = [];

  // 特殊处理完全水平和垂直的情况
  if (sourcePoint.pos[0] === targetPoint.pos[0] && _so[1] !== _to[1] && _so[0] === 0 && _to[0] === 0) {
    result = [point[0], point[1] + majorAnchor * _so[1]];
    return result;
  }

  if (sourcePoint.pos[1] === targetPoint.pos[1] && _so[0] !== _to[0] && _so[1] === 0 && _to[1] === 0) {
    result = [point[0] + majorAnchor * _so[0], point[1]];
    return result;
  }

  // 平常情况
  var perpendicular = _so[0] !== _to[0] || _so[1] === _to[1];
  if (!perpendicular) {
    if (_so[0] === 0) {
      result.push(sourcePoint.pos[0] < targetPoint.pos[0] ? point[0] + minorAnchor : point[0] - minorAnchor);
    } else {
      result.push(point[0] - (majorAnchor * _so[0]));
    }

    if (_so[1] === 0) {
      result.push(sourcePoint.pos[1] < targetPoint.pos[1] ? point[1] + minorAnchor : point[1] - minorAnchor);
    } else {
      result.push(point[1] - (majorAnchor * _to[1]));
    }
  } else {
    if (_to[0] === 0) {
      result.push(targetPoint.pos[0] < sourcePoint.pos[0] ? point[0] + minorAnchor : point[0] - minorAnchor);
    } else {
      result.push(point[0] + (majorAnchor * _to[0]));
    }

    if (_to[1] === 0) {
      result.push(targetPoint.pos[1] < sourcePoint.pos[1] ? point[1] + minorAnchor : point[1] - minorAnchor);
    } else {
      result.push(point[1] + (majorAnchor * _so[1]));
    }
  }
  return result;
}

//二阶贝塞尔曲线
export function _findSecondControlPoint(sourcePoint, targetPoint, _so, _to, shapeType) {
  //中点
  let midX = (sourcePoint.pos[0] + targetPoint.pos[0]) / 2;
  let midY = (sourcePoint.pos[1] + targetPoint.pos[1]) / 2;
  //四分之一点的位置
  let quarterX = midX - ((midX - sourcePoint.pos[0]) / 2);
  let quarterY = midY - ((midY - sourcePoint.pos[1]) / 2);
  //四分之三位置
  let threeQuarterX = midX + ((midX - sourcePoint.pos[0]) / 2);
  let threeQuarterY = midY + ((midY - sourcePoint.pos[1]) / 2);
  let basicPointX = midX;
  let basicPointY = midY;
  if (shapeType === "Bezier2-1") {
    basicPointX = midX;
    basicPointY = midY;
  } else if (shapeType === "Bezier2-2") {
    basicPointX = quarterX;
    basicPointY = quarterY;
  } else if (shapeType === "Bezier2-3") {
    basicPointX = threeQuarterX;
    basicPointY = threeQuarterY;
  }
  let ctrlPoint;
  let offset;
  let _width = Math.abs(sourcePoint.pos[0] - sourcePoint.pos[0]);
  let _height = Math.abs(sourcePoint.pos[1] - targetPoint.pos[1]);
  const dist = Math.sqrt(_width * _width + _height * _height);
  //正常情况
  let midK = (targetPoint.pos[1] - sourcePoint.pos[1]) / (targetPoint.pos[0] - sourcePoint.pos[0]);
  if (midK === 0) {
    if (sourcePoint.pos[0] < targetPoint.pos[0] && _so[0] === 1 && _to[0] === -1 ||
      sourcePoint.pos[0] > targetPoint.pos[0] && _so[0] === -1 && _to[0] === 1 ||
      sourcePoint.pos[1] < targetPoint.pos[1] && _so[1] === 1 && _to[1] === -1 ||
      sourcePoint.pos[1] > targetPoint.pos[1] && _so[1] === -1 && _to[1] === 1) {
      return ctrlPoint = [midX, midY];
    }
  }
  let k = -1 / midK;
  let b = basicPointY - k * basicPointX;
  offset = Math.sqrt(3) * dist / 6;
  let t;
  let _sum0 = _so[0] + _to[0];
  let _sum1 = _so[1] + _to[1];
  if (targetPoint.pos[0] < sourcePoint.pos[0] && targetPoint.pos[1] < sourcePoint.pos[1] && ((_sum0 === 0 && _sum1 ===
    0) || (_sum0 === 1 && _sum1 === -1))) {
    t = 1;
  } else if (targetPoint.pos[0] > sourcePoint.pos[0] && targetPoint.pos[1] < sourcePoint.pos[1] && (_sum0 === 1 &&
    _sum1 === 1)) {
    t = 1;
  } else if (targetPoint.pos[0] < sourcePoint.pos[0] && targetPoint.pos[1] > sourcePoint.pos[1] && ((_sum0 === 0 &&
    _sum1 === 0) || (_sum0 === 1 && _sum1 === 1))) {
    t = 1;
  } else if (targetPoint.pos[0] > sourcePoint.pos[0] && targetPoint.pos[1] > sourcePoint.pos[1] && (_sum0 === 1 &&
    _sum1 === -1)) {
    t = 1;
  } else {
    t = -1;
  }
  ctrlPoint = [basicPointX + (offset * t), (k * (basicPointX + (offset * t))) + b];
  //特殊情况：
  let percent = 0.25;
  let minorDist = 100;
  offset = dist * percent + minorDist;
  let so_offsetX = 0;
  let so_offsetY = 0;
  let to_offsetX = 0;
  let to_offsetY = 0;
  if (_so[0] === -1 && targetPoint.pos[0] > sourcePoint.pos[0] ||
    _so[0] === 1 && targetPoint.pos[0] < sourcePoint.pos[0] ||
    _so[1] === 1 && targetPoint.pos[1] < sourcePoint.pos[1] ||
    _so[1] === -1 && targetPoint.pos[1] > sourcePoint.pos[1]) {
    if (_so[0] !== 0) {
      so_offsetX = offset * _so[0];
    }
    if (_so[1] !== 0) {
      so_offsetY = offset * _so[1];
    }
    return ctrlPoint = [sourcePoint.pos[0] + so_offsetX, sourcePoint.pos[1] + so_offsetY];
  }
  if (_so[0] === _to[0] && _so[1] === _to[1] ||
    _so[0] !== 0 && targetPoint.pos[1] < sourcePoint.pos[1] && _to[1] === -1 ||
    _so[0] !== 0 && targetPoint.pos[1] > sourcePoint.pos[1] && _to[1] === 1 ||
    _so[1] !== 0 && targetPoint.pos[0] < sourcePoint.pos[0] && _to[0] === -1 ||
    _so[1] !== 0 && targetPoint.pos[0] > sourcePoint.pos[0] && _to[0] === 1
  ) {
    if (_to[0] !== 0) {
      to_offsetX = offset * _to[0];
    } else if (_to[1] !== 0) {
      to_offsetY = offset * _to[1];
    }
    ctrlPoint = [targetPoint.pos[0] + to_offsetX, targetPoint.pos[1] + to_offsetY];
  }
  return ctrlPoint;
}

export function _findManhattanPoint(points, pos) {
  let result = undefined;
  let gap = Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    let _dir = points[i].x === points[i + 1].x ? 'vertical' : 'horizontal';
    let _from = points[i];
    let _to = points[i + 1];

    if (_dir === 'vertical') {
      if (gap > Math.abs(pos.x - _from.x)) {
        gap = Math.abs(pos.x - _from.x);
        result = {
          from: _from,
          to: _to,
          direction: _dir,
          index: i
        }
      }
    } else {
      if (gap > Math.abs(pos.y - _from.y)) {
        gap = Math.abs(pos.y - _from.y);
        result = {
          from: _from,
          to: _to,
          direction: _dir,
          index: i
        }
      }
    }
  }
  return result;
}
