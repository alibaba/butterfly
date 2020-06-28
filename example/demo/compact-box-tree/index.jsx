'use strict';
import React, {Component} from 'react';
require('./index.less');

const Canvas = require('../../../index.js').TreeCanvas;
const {mockData} = require('./data');

class CompactBoxTree extends Component {
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
        }
      },
      layout: {
        type: 'compactBox',
        options: {
          direction: 'TB',
          getHeight(d) {
            return 60;
          },
          getWidth(d) {
            return 120;
          },
          getHGap(d) {
            return 20;
          },
          getVGap(d) {
            return 80;
          },
        }
      }
    });
    this.canvas.draw(mockData, {}, () => {
      this.canvas.focusCenterWithAnimate();
    });
    this.canvas.on('events', (data) => {
      console.log(data);
    });
  }
  render() {
    return (
      <div className='compact-box-tree-page'>
        <div className="compact-box-tree-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = CompactBoxTree;
