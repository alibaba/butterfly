'use strict';

import Canvas from "./baseCanvas";
import Node from '../node/baseNode';
import Layout from '../utils/layout/layout';
const _ = require('lodash');

class DrageCanvas extends Canvas {
  constructor(options) {
    super(options);
    this._NodeClass = Node;
  }
  drageReDraw(newParam){
    let addResultNodes = this.nodes.map((item) => {
      delete item.left; 
      delete item.top; 
      return item.options
    });
    // 需要继续check
    Layout.drageLayout({
      rankdir: newParam.rankdir || _.get(this.layout, 'options.rankdir') || 'TB',
      align: newParam.align || _.get(this.layout, 'options.align'),
      nodeSize: newParam.nodeSize || _.get(this.layout, 'options.nodeSize'),
      nodesepFunc: newParam.nodesepFunc || _.get(this.layout, 'options.nodesepFunc'),
      ranksepFunc: newParam.ranksepFunc || _.get(this.layout, 'options.ranksepFunc'),
      nodesep: newParam.nodesep || _.get(this.layout, 'options.nodesep') || 50,
      ranksep: newParam.ranksep || _.get(this.layout, 'options.ranksep') || 50,
      controlPoints: newParam.controlPoints || _.get(this.layout, 'options.controlPoints') || false,
      data: {
        nodes: addResultNodes,
        edges: this.edges.map(item => ({
          source: item.type === 'endpoint' ? item.sourceNode : item.sourceNode.id,
          target: item.type === 'endpoint' ? item.targetNode : item.targetNode.id
        }))
      }});
      this.nodes.forEach((item, index) => {
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
  // addNode后重新布局
}

export default DrageCanvas;