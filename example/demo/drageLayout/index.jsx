'use strict';
import React, {Component} from 'react';
const Canvas = require('../../../index.js').Canvas;
const Layout = require('../../../index.js').Layout;
const mockData = require('./data.js');
const RelationEdge = require('./edge_relation.jsx');
const Train = require('./node_train.jsx');

require('./index.less');
require('butterfly-dag/dist/index.css');

class DrageLayout extends Component {
  constructor() {
    super();
    this.canvas = null;
  }
  componentDidMount() {
    let root = document.getElementById('dag-canvas');
    this.canvas = new Canvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: false,    // 可连线
      draggable: true,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
      layout: {
        type: 'drageLayout',
        options: {
          rankdir: 'BT',
          align: 'DR',
          nodesep: 60,
          ranksep: 60,
          controlPoints: false,
        },
      },
      theme: {
        edge: {
          type: 'Straight',
          Class: RelationEdge
        },
        endpoint: {
          position: ['Top', 'Bottom']
        }
      }
    });
    this.canvas.draw(mockData);
  }
  addNode = () => {
    this.canvas.addNodes([
      {
        id: 'test6',
        name: '王七萌',
        type: 'people',
        Class: Train,
        color: '#19A97B'
      },
      {
        id: 'test7',
        name: '王吧萌',
        type: 'people',
        Class: Train,
        color: '#19A97B'
      }
    ]);
    this.canvas.addEdges([
      {
        source: 'test2',
        target: 'test6',
      },
      {
        source: 'test2',
        target: 'test7',
      },
    ]);
    // 重新布局需要自己在业务中实现
    this.drageReDraw();
  }
  drageReDraw(newParam) {
    let {nodes, layout, edges} = this.canvas;
    let addResultNodes = nodes.map((item) => {
      return item.options
    });
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
  render() {
    return (
      <div className='drageLayout-page'>
        <div onClick={this.addNode}>添加节点</div>
        <div className="flow-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = DrageLayout;
