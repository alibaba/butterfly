'use strict';

const EventEmit = require('event-emitter');

class Canvas {
  constructor() {
    // root             根节点
    // layout           布局支持
    // zoomable         是否可放大缩小
    // moveable         是否可移动
    // draggable        是否可拖动节点
    // linkable         是否可连接线条
    // disLinkable      是否可取消连线
    // theme            主题配置
    // global           公共配置

  }

  // 渲染节点
  draw() {}

  // 获取节点
  getNode() {}

  // 获取线条
  getEdge() {}

  // 获取节点组
  getGroup() {}

  // 添加节点
  addNode() {}

  // 批量添加节点
  addNodes() {}

  // 添加线条
  addEdge() {}

  // 批量添加线条
  addEdges() {}

  // 批量添加节点组
  addGroups() {}

  // 删除节点
  removeNode() {} 

  // 批量删除节点
  removeNodes() {}

  // 删除线条
  removeEdge() {}

  // 批量删除线条
  removeEdges() {}

  // 删除节点组
  removeGroup() {}

  // 获取相邻的线条
  getNeighborEdges() {}

  // 获取相邻的节点
  getNeighborNodes() {}

  // 获取无环血缘图
  getNeighborNodesAndEdgesByLevel() {}
  getAdjcentTable() {} // 需要改为内部方法

  // 获取缩放值
  getZoom() {}
  // 动态设置可缩放
  setZoomable() {}
  // 动态设置缩放值
  zoom() {}

  // 获取偏移值
  getOffset() {}
  // 动态设置可移动
  setMoveable() {}
  // 动态设置移动
  move() {}

  // 获取中心点
  getOrigin() {}
  // 动态设置中心点
  setOrigin() {}

  // 获取数据结构
  getDataMap() {}

  // 设置网格模式
  setGirdMode() {}
  // 设置网格线条
  setGuideLine() {}
  // 设置辅助线
  justifyCoordinate() {}

  // 设置框选模式
  setSelectMode() {}

  // 设置某些联合值，即框选的元素
  getUnion() {}
  // 设置所有联合值，即框选的元素
  getAllUnion() {}

  // 添加联合值
  add2Union() {}
  // 删除某些联合值
  removeUnion() {}
  // 删除所有联合值
  removeAllUnion() {}

  // 聚焦单个节点（看看需要合并不）
  focusNodeWithAnimate() {}
  // 聚焦某些节点
  focusNodesWithAnimate() {}

  // 画布坐标转换为终端坐标
  canvas2terminal() {}
  // 终端坐标转换为画布坐标
  terminal2canvas() {}

  // 保存为图片
  save2img() {}

  // ********* 需要优化的api ********* 
  
  // 更新画布的大小 
  updateRootResize() {}

  // ********* 需要新增的api ********* 

  // 单击的回调
  click() {}

  // 双击的回调
  doubleClick() {}

  // 右键的回调
  onContextmenu() {}

  // 集成menu

  // 生成/关闭缩略图
  
}

EventEmit(Canvas.prototype);

module.exports = Canvas;
