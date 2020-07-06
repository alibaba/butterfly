'use strict';
import React, {Component} from 'react';
require('./index.less');
require('butterfly-dag/dist/index.css');

const Canvas = require('../../../index.js').Canvas;
const mockData = require('./data.js');

class LoginNew extends Component {
  constructor() {
    super();
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
          type: 'AdvancedBezier',
        }
      }
    });
    this.canvas.draw(mockData);
    this.canvas.on('events', (data) => {
      console.log(data);
    });
  }
  render() {
    return (
      <div className='login'>
        <div className="login-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = LoginNew;
