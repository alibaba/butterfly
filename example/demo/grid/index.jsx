'use strict';
import React, {Component} from 'react';

const Canvas = require('../../../index.js').Canvas;
const {mockData} = require('./data');
require('./index.less');
require('butterfly-dag/dist/index.css');

class Grid extends Component {
  constructor() {
    super();
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
        type: 'gridLayout',
        options: {
          link: {
            // 线条的距离
            distance: 50,
            // 线条的粗细
            strength: 1
          },
           // 布局画布总宽度
          width: 150,
          // 布局画布总长度
          height: 100,
          // 布局相对起始点
          begin: [20, 20],
          preventOverlap: true,
          preventOverlapPadding: 10,
          condense: false,
          //宽高
          rows: undefined,
          cols: undefined,
          //位置
          position: undefined,
          // 排序方式
          sortBy: 'degree',
          nodeSize: 30,
        },
      },
      theme: {
        edge: {
          type: 'Straight'
        }
      }
    });
    // setTimeout(() => {
    //   this.canvas.draw(mockData);
    // }, 500);
    // console.log(mockData);
    this.canvas.draw(mockData);

    this.canvas.on('events', (data) => {
      console.log(data);
    });
  }
  render() {
    return (
      <div className='grid-tree-page'>
        <div className="grid-tree-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = Grid;
