'use strict';
import React, {Component} from 'react';
require('./index.less');
require('butterfly-dag/dist/index.css');

const IndustryCanvas = require('./canvas');
const mockData = require('./data.js');

class Industry extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    let root = document.getElementById('dag-canvas');
    this.canvas = new IndustryCanvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: false,    // 可连线
      draggable: true,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
      css: {
        groupHoverClass: 'datac-group-drag-hover',   // 节点移动到上面新增的class 
        groupActiveClass: 'datac-group-drag-active'   // 节点可移动到上面新增的class
      },
      theme: {
        edge: {
          type: 'AdvancedBezier'
        },
      }
    });
    this.canvas.draw(mockData);
    
  }
  render() {
    return (
      <div className='industry-page'>
        <div className="industry-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = Industry;
