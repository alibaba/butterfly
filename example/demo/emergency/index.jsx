'use strict';
import React, {Component} from 'react';
require('./index.less');
require('butterfly-dag/dist/index.css');

const Canvas = require('../../../index.js').Canvas;
const mockData = require('./data.js');

class Emergency extends Component {
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
          type: 'Manhattan',
          arrow: true
        },
        // 拖动边缘处自动适应画布
        autoFixCanvas: {
          enable: true
        }
      }
    });
    this.canvas.draw(mockData, () => {
      // 第三个参数 include ， touch ， senior
      // include: 全部包含则能框选中
      // touch: 触碰到则能选中
      // senior: 从左到右需要全部包含；从右到左只需要触碰即可
      this.canvas.setSelectMode(true, ['node', 'endpoint', 'edge'], 'senior');
    });
    this.canvas.on('events', (data) => {
      console.log(data);
    });
  }
  render() {
    return (
      <div className='emergency-page'>
        <div className="emergency-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = Emergency;
