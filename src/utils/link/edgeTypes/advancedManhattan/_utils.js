'use strict';

import Point from './point';

export const moveAndExpand = (obj, r) => {
  obj.width = obj.width || 150;
  obj.height = obj.height || 65;
  obj.x += r.x || 0;
  obj.y += r.y || 0;
  obj.width += r.width || 0;
  obj.height += r.height || 0;
  return obj;
}

// 有可能有问题
export const snapToGrid = (gridSize, type, data) => {
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
  return bbox;
}