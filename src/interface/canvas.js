'use strict';

const EventEmit = require('event-emitter');

class Canvas {
  constructor() {}

  /**
   * 渲染画布
   * @param {array} data - 画布的数据(group,node,link)
   */
  draw(data) {}

  /**
   * 获取单个节点
   * @param {string} id - 单个节点的Id
   * @return {object} - 单个节点
   */
  getNode(id) {}

  /**
   * 获取单个连线
   * @param {string} id - 单个连线的Id
   * @return {object} - 单个连线
   */
  getEdge(id) {}

  /**
   * 获取单个节点组
   * @param {string} id - 单个节点组的Id
   * @return {object} - 单个节点组
   */
  getGroup(id) {}

  /**
   * 添加单个节点组
   * @param {object} group - 节点组的数据结构
   */
  addGroup(group) {}

  /**
   * 添加单个节点
   * @param {object} node - 节点的数据结构
   */
  addNode(node) {}

  /**
   * 添加单个连线
   * @param {object} link - 连线的数据结构
   */
  addLink(link) {}

  /**
   * 添加多个节点组
   * @param {array} groups - 节点组的数据结构
   */
  addGroups(groups) {}

  /**
   * 添加多个节点
   * @param {array} nodes - 节点的数据结构
   */
  addNodes(nodes) {}

  /**
   * 添加多个连线
   * @param {array} links - 连线的数据结构
   */
  addLinks(links) {}

  /**
   * 删除单个节点
   * @param {string} id - 节点的id
   */
  removeNode(id) {}

  /**
   * 删除多个节点
   * @param {array} ids - 节点的ids
   */
  removeNodes(ids) {}

  /**
   * 删除连线
   * @param {string} id - 连线的id
   */
  removeEdge(id) {}

  /**
   * 删除节点组
   * @param {string} id - 节点组的id
   */
  removeGroup(id) {}

  /**
   * 获取相邻连线
   * @param {string} id - 节点的id
   * @return {array} - 连线
   */
  getNeighborEdges(id) {}

  /**
   * 获取相邻节点
   * @param {string} id - 节点的id
   * @return {array} - 节点
   */
  getNeighborNodes(id) {}

  /**
   * 获取缩放倍数
   * @return {float} - 缩放倍数
   */
  getZoom() {}

  /**
   * 设置是否能缩放
   * @param {boolean} flat - 缩放标记
   */
  setZoomable(flat) {}

  /**
   * 设置缩放倍数
   * @param {float} data - 缩放倍数(0-1之间)
   */
  zoom(data) {}

  /**
   * 获取移动位置
   * @return {array} - 移动位置
   */
  getMovePosition() {}

  /**
   * 设置是否能移动
   * @param {boolean} flat - 移动标记
   */
  setMoveable(flat) {}

  /**
   * 设置移动位置
   * @param {array} data - 移动位置([x,y])
   */
  move(data) {}

  /**
   * 设置是否能框选
   * @param {boolean} flat - 框选标记
   */
  setSelectMode(flat) {}

  /**
   * 聚焦到某个节点
   * @param {id} id - 移动标记
   */
  focusNodeWithAnimate(id) {}

  /**
   * 获取整个画布上的数据结构
   * @return {object} - 数据结构
   */
  getDataMap() {}

  /**
   * 绑定事件(已经集成进里面)
   * @param {string} type - 事件类型
   */
  // on(type, callback) {}

  /**
   * 发送事件(已经集成进里面)
   * @param {string} type - 事件类型
   */
  // emit(type, callback) {}

  /**
   * 解绑事件
   */
  off() {}

  /**
   * 连线接上的事件回调(可能需要废弃)
   * @param {object} conn - 连线的对象
   */
  connection(conn) {}
}

EventEmit(Canvas.prototype);

module.exports = Canvas;
