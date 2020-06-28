'use strict';
const Canvas = require('../../../index.js').Canvas;
const Layout = require('../../../index.js').Layout;

class DrageCanvas extends Canvas {
  constructor(options) {
    super(options);
  }
  drageReDraw(newParam) {
    let {nodes, layout, edges} = this;
    let addResultNodes = nodes.map((item) => {
      return item.options
    });
    if(newParam) {
      layout.options = {
        ...layout.options,
        ...newParam
      }
    }
    Layout.drageLayout({
      rankdir: (newParam && newParam.rankdir) || _.get(layout, 'options.rankdir') || 'TB',
      align: (newParam && newParam.align) || _.get(layout, 'options.align'),
      nodeSize: (newParam && newParam.nodeSize) || _.get(layout, 'options.nodeSize'),
      nodesepFunc: (newParam && newParam.nodesepFunc) || _.get(layout, 'options.nodesepFunc'),
      ranksepFunc: (newParam && newParam.ranksepFunc) || _.get(layout, 'options.ranksepFunc'),
      nodesep: (newParam && newParam.nodesep) || _.get(layout, 'options.nodesep') || 50,
      ranksep: (newParam && newParam.ranksep) || _.get(layout, 'options.ranksep') || 50,
      controlPoints: (newParam && newParam.controlPoints) || _.get(layout, 'options.controlPoints') || false,
      data: {
        nodes: addResultNodes,
        edges: edges.map(item => ({
          source: item.type === 'endpoint' ? item.sourceNode : item.sourceNode.id,
          target: item.type === 'endpoint' ? item.targetNode : item.targetNode.id
        }))
      }});
    // 布局计算完位置后left和top赋值给node节点
    nodes.forEach((item, index) => {
      let currentNodeNewLeft = addResultNodes[index].left;
      let currentNodeNewTop = addResultNodes[index].top;
      let currentNodeNewPosInfo = addResultNodes[index].posInfo;
      if (item.top !== currentNodeNewTop || item.left !== currentNodeNewLeft) {
        item.options.top = currentNodeNewTop;
        item.options.left = currentNodeNewLeft;
        item.options.posInfo = currentNodeNewPosInfo;
        item.moveTo(currentNodeNewLeft, currentNodeNewTop);
      }
    });
  }
}

export default DrageCanvas;