'use strict';

class Node {
  constructor() {}

  /**
   * 渲染节点
   * @param {object} obj - 节点的数据结构
   * @return {dom} dom - 返回的dom会渲染到图上
   */
  draw(obj) {}

  /**
   * remove的方法
   */
  remove() {}

  /**
   * remove的方法
   * @param {number} x - x坐标
   * @param {number} y - y坐标
   */
  updatePosition(x, y) {}

  /**
   * focus回调
   */
  focus() {}

  /**
   * unFocus回调
   */
  unFocus() {}

}

module.exports = Node;
