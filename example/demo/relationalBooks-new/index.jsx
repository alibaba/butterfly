'use strict';
import React, {Component} from 'react';
const Canvas = require('../../../index.js').Canvas;
const mockData = require('./data.js');

require('./index.less');
require('butterfly-dag/dist/index.css');

class RelationalBooksNew extends Component {
  constructor() {
    super();
    this.canvas = null;
  }
  componentDidMount() {
    let root = document.getElementById('dag-canvas');
    this.canvas = new Canvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: true,    // 可连线
      draggable: true,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
      theme: {
        edge: {
          type: 'Straight',
        },
      }
    });
    this.canvas.setMinimap(true);
    this.canvas.draw(mockData, () => {
      this.canvas.focusCenterWithAnimate();
    });
  }
  render() {
    return (
      <div className='relational-books-page'>
        <div className="flow-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = RelationalBooksNew;
