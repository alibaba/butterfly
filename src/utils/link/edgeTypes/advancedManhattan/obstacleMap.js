'use strict';

import { moveAndExpand, snapToGrid } from './_utils';

import Point from './point';

const containsPoint = (p, data) => {
  p = new Point(p.x, p.y);
  return p.x >= data.x && p.x <= data.x + data.w && p.y >= data.y && p.y <= data.y + data.h;
}

export default class ObstacleMap {
  constructor(opt) {
    this.map = {};
    this.options = opt;
    // tells how to divide the paper when creating the elements map
    this.mapGridSize = 100;
  }
  build(nodes) {
    var opt = this.options;
    // 构建所有元素的地图，以便更快地查询障碍物（即是否包含一个点
    // 在任何障碍物中？）（简化的网格搜索）。
    // 论文被分成更小的单元格，每个单元格都包含关于哪个单元格的信息
    // 元素属于它。当我们查询一个点是否位于障碍物内时，我们
    // 不需要通过所有障碍，我们只检查特定单元格中的障碍。
    var mapGridSize = this.mapGridSize;
    nodes.reduce(function(map, element) {
      element.x = element.left;
      element.y = element.top;
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
      return map;
    }, this.map);
    return this;
  }
  // 判断point是否在网格内
  isPointAccessible(point) {
    var mapKey = point.clone().snapToGrid(this.mapGridSize).toString();
    return _.toArray(this.map[mapKey]).every(function(obstacle) {
      obstacle.containsPoint = containsPoint;
      return !obstacle.containsPoint(point, obstacle);
    });
  }
}