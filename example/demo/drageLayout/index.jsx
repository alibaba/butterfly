'use strict';
import React, {Component} from 'react';
const Canvas = require('../../../index.js').Canvas;
const mockData = require('./data.js');
const RelationEdge = require('./edge_relation.jsx');

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
  render() {
    return (
      <div className='drageLayout-page'>
        <div className="flow-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = DrageLayout;
