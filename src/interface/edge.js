'use strict';

class Edge {
  constructor() {
    // id                 节点唯一标志
    // targetNode         目标节点
    // targetEndpoint     目标锚点
    // sourceNode         源节点
    // sourceEndpoint     源锚点
    // type               "node" or "endpoint"，标志类型的
    // shapeType          线条类型
    // label              设置线条上的字体
    // options            数据的透传
    // dom                线条dom
    // labelDom           label的dom
    // arrowDom           箭头的dom

    
    // 箭头部分看看需要优化不？
    // arrow              是否有箭头
    // arrowPosition      箭头的位置
    // arrowOffset        箭头起始点

    // 需要优化的
    // isExpandWidth      拓展线条
    // eventHandlerDom    代替绑定事件的dom
    // orientationLimit   限制方向


    // 需要优化的
    // scope           scope相同可拉进group里面
    // endpoints       endpoint对象
    // _endpointsData  真实的endpoint数据

    // 需要悬空
  }

  // 渲染节点
  draw() {}

  // 重绘节点
  redraw() {}

  // 渲染label
  drawLabel() {}

  // 重绘label
  redrawLabel() {}

  // 渲染arrow
  drawArrow() {}

  // 重回arrow
  redrawArrow() {}

  // 判断是否能连接的方法
  isConnect() {}

  // 销毁节点
  destroy() {}

  // ********* 需要新增的api ********* 

  // 删除线条
  remove() {}

  // 单击的回调
  click() {}

  // hover的回调
  hover() {}

  // focus回调
  focus() {}

  // unFocus回调
  unFocus() {}

}

export default Edge;
