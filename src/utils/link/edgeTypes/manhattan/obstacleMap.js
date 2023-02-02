'use strict';

import _ from 'lodash';

export default class ObstacleMap {
  constructor(options) {
    this.map = {};
    this.options = _.assign({
      girdGap: 10, // 网格间隔
      padding:  10// 
    }, options);
    this.MAP_CONST = {
      'EMPTY': '1@1', // 空的key
    }
    this.sourceCell = {};
    this.targetCell = {};
    this.sourceNodeId = '';
    this.targetNodeId = '';
  }
  // 初始化开始、结束点
  initStatus(sourcePoint, targetPoint, sourceNodeId, targetNodeId) {
    this.sourceCell = this.getGirdCell(sourcePoint.pos[0], sourcePoint.pos[1]);
    this.targetCell = this.getGirdCell(targetPoint.pos[0], targetPoint.pos[1]);
    this.sourceNodeId = sourceNodeId;
    this.targetNodeId = targetNodeId;
  }
  // 建立网格地图
  build(nodes) {
    let minleft = Infinity;
    let maxRight = -Infinity;
    let minTop = Infinity;
    let maxBottom = -Infinity;

    // 寻找出地图最边缘的坐标
    nodes.forEach((item) => {
      if (item.left < minleft) {
        minleft = item.left - this.options.padding;
      }
      let _right = item.left + item.width;
      if (_right > maxRight) {
        maxRight = _right + this.options.padding;
      }
      if (item.top < minTop) {
        minTop = item.top - this.options.padding;
      }
      let _bottom = item.top + item.height;
      if (_bottom > maxBottom) {
        maxBottom = _bottom + this.options.padding;
      }
    });

    minleft = this.fix(minleft, -1);
    maxRight = this.fix(maxRight);
    minTop = this.fix(minTop, -1);
    maxBottom = this.fix(maxBottom);
    
    // 建立空白地图
    for(let i = minTop; i <= maxBottom; i+=this.options.girdGap) {
      for(let j = minleft; j <= maxRight; j+=this.options.girdGap) {
        this.map[`${j}@${i}`] = this.MAP_CONST.EMPTY;
      }
    }

    // 建立节点地图
    nodes.forEach((node) => {
      let nl = node.left;
      let nr = node.left + node.width;
      let nt = node.top;
      let nb = node.top + node.height;
 
      // 计算节点边缘的网格
      let ltGirdInfo = this.getGirdCell(nl, nt);
      let rtGirdInfo = this.getGirdCell(nr, nt);
      let lbGirdInfo = this.getGirdCell(nl, nb);
      let rbGirdInfo = this.getGirdCell(nr, nb);
      
      for(let i = ltGirdInfo.yCell; i <= lbGirdInfo.yCell; i+=this.options.girdGap) {
        for(let j = ltGirdInfo.xCell; j <= rtGirdInfo.xCell; j+=this.options.girdGap) {
          this.map[`${j}@${i}`] = node.id;
        }
      }
    });

  }
  // 是否被占用
  hasObstacles(key) {
    let moveNodeId = this.map[key];
    if (this.map[key] !== this.MAP_CONST.EMPTY) {
      let cell = key.toString().split('@').map((item) => parseInt(item));
      if (moveNodeId === this.sourceNodeId && (cell[0] === this.sourceCell.xCell || cell[1] === this.sourceCell.yCell)) {
        return false;
      } else if (moveNodeId === this.targetNodeId && (cell[0] === this.targetCell.xCell || cell[1] === this.targetCell.yCell)) {
        return false;
      }
    }
    return this.map[key] !== this.MAP_CONST.EMPTY;
  }
  // 传入一个坐标获取单元格
  getGirdCell(x, y) {
    let _x = this.round(x);
    let _y = this.round(y);
    return {
      x,
      y,
      xCell: _x,
      yCell: _y,
      key: `${_x}@${_y}`
    }
  }
  // 节点坐标发生变化时需要更新地图
  updateMap(nodes) {

  }
  // 找出路径后清理地图，为下一次计算做准备
  clearPath() {

  }
  // 按照网格来四舍五入
  round(num) {
    let tmp = num % this.options.girdGap;
    if (tmp -  this.options.girdGap / 2 >= 0) {
      return num - tmp + this.options.girdGap;
    } else {
      return num - tmp;
    }
  }
  // 按照girdGap进位
  fix(num, isPositive = 1) {
    let tmp = num % this.options.girdGap;
    let res = num;
    if (tmp !== 0) {
      res = (num - tmp) + this.options.girdGap * isPositive;
    }
    return res;
  }
  // 清楚地图，防止内存泄漏
  clear() {
    this.map = {};
  }
}