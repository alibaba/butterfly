'use strict';

class Group {
  constructor() {
    // id        节点唯一标志
    // top       坐标y
    // left      坐标x
    // width     节点组宽度
    // height    节点组高度
    // resize    标志是否能resize
    // dom       实际的dom
    // nodes     里面包含的节点对象
    // options   数据的透传
    // _on       节点发送事件
    // _emit     节点发送事件
    // _global   全局的配置



    // 需要优化的
    // scope           scope相同可拉进group里面
    // endpoints       endpoint对象
    // _endpointsData  真实的endpoint数据

  }

  // 渲染节点
  draw() {}

  // 添加节点
  addNode() {}

  // 批量添加节点
  addNodes() {}

  // 获取宽度
  getWidth() {}

  // 获取高度
  getHeight() {}

  // 删除节点
  removeNode() {}

  // 批量删除节点
  removeNodes() {}

  // 设置是否可缩放
  setResize() {}

  // 设置大小
  setSize() {}
  
  // 移动group
  moveTo() {}

  // 获取锚点
  getEndpoint() {}

  // 添加锚点
  addEndpoint() {}

  // remove的方法
  remove() {}

  // 销毁的方法
  destroy() {}

  // ********* 需要新增的api ********* 

  // 删除锚点
  removeEndpoint() {}

  // 折叠的方法
  collapse() {}

  // 伸展的方法
  stretch() {}

  // 单击的回调
  click() {}

  // 双击的回调
  doubleClick() {}

  // 右键的回调
  onContextmenu() {}

  // hover的回调
  hover() {}

  // focus回调
  focus() {}

  // unFocus回调
  unFocus() {}
}

export default Group;
