import React from 'react';
import './index.less';
import {mockData} from './data';

require('butterfly-dag/dist/index.css');
const Canvas = require('../../../index.js').Canvas;

class Flow extends React.Component {
  constructor() {
    super();
    this.canvas = null;
  }
  componentDidMount() {
    // css里面的类名限制太死了
    let root = document.getElementById('dag-canvas');
    this.canvas = new Canvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: false,    // 可连线
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
    // this.canvas.zoom(0.5);
  }
  render() {
    return (
      <div className='flow-page'>
        <div className="flow-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

export default Flow;