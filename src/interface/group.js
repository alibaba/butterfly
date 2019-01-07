'use strict';

class Group {
  constructor() {}

  /**
   * 渲染节点
   * @param {object} obj - 节点的数据结构
   * @return {dom} dom - 返回的dom会渲染到图上
   */
  draw(obj) {}

  /**
   * 添加节点
   * @param {array} node - 添加多个节点到节点组里面
   */
  addNode(node) {}

  /**
   * 添加节点
   * @param {array} nodes - 添加多个节点到节点组里面
   */
  addNodes(nodes) {}

  /**
   * 设置是否可缩放
   * @param {boolean} flat - 是否缩放的标记
   */
  setResize(flat) {}

  /**
   * remove的方法
   */
  remove() {}

  /**
   * focus回调
   */
  focus() {}

  /**
   * unFocus回调
   */
  unFocus() {}
}

module.exports = Group;
