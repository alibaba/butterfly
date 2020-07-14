'use strict';
import React, {Component} from 'react';
// const DrageCanvas = require('../../../index.js').DrageCanvas;
const Canvas = require('../../../index.js').Canvas;
const mockData = require('./data.js');

require('./index.less');
require('butterfly-dag/dist/index.css');

class ConcentLayout extends Component {
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
        type: 'concentricLayout',
        options: {
          maxLevelDiff: 0.5,
          sortBy: 'degree',
          minNodeSpacing: 40,
          preventOverlap: true,
        },
      },
    });
    this.canvas.draw(mockData);
  }
  render() {
    return (
      <div className='concentLayout-page'>
        <div className="flow-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = ConcentLayout;
