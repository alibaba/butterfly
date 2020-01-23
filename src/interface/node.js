'use strict';

class Node {
  constructor() {
    // id        节点唯一标志
    // top       坐标y
    // left      坐标x
    // group     存在于哪个节点组上
    // dom       节点的dom元素
    // draggable 该节点是否能拖动标志，可覆盖全局的
    // options   数据的透传
    // _on       节点发送事件
    // _emit     节点发送事件
    // _global   全局的配置


    // 需要优化的
    // scope           scope相同可拉进group里面
    // endpoints       endpoint对象
    // _endpointsData  真实的endpoint数据
    // _isMoving       标识是否在移动做，兼容冒泡
  }

  // 渲染节点
  draw() {}

  // 获取锚点
  getEndpoint() {}

  // 添加锚点
  addEndpoint() {}

  // 删除锚点
  removeEndpoint() {}

  // 移动节点
  moveTo() {}

  // 获取宽度
  getWidth() {}

  // 获取高度
  getHeight() {}

  // 设置该节点是否能拖动，能覆盖全局
  setDraggable() {}

  // remove的方法
  remove() {}

  // 销毁的方法
  destroy() {}


  // ********* 需要新增的api ********* 


  // focus回调
  focus() {}

  // unFocus回调
  unFocus() {}

  // 单击的回调
  click() {}

  // 双击的回调
  doubleClick() {}

  // 右键的回调
  onContextmenu() {}

  // hover的回调
  hover() {}

}

export default Node;
