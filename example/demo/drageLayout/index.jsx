'use strict';
import React, {Component} from 'react';
const DrageCanvas = require('../../../index.js').DrageCanvas;
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
    this.canvas = new DrageCanvas({
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
    ])
    this.canvas.drageReDraw({rankdir: ''});
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
