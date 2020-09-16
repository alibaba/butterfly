'use strict';
import React, {Component} from 'react';

const Canvas = require('../../../index.js').Canvas;
const {data} = require('./data');
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
        type: 'fruchterman',
        options: {
            // 布局画布总宽度
            width: 500,
            // 布局画布总长度
            height: 500,
            /** 停止迭代的最大迭代数 */
            // maxIteration: 1000,
            /** 布局中心 */
            center: [250, 250],
            /** 重力大小，影响图的紧凑程度 */
            gravity: 5,
            /** 速度 */
            speed: 5,
            /** 是否产生聚类力 */
            clustering: true,
            /** 聚类力大小 */
            clusterGravity: 8,
            link: {
                // 线条的距离
                distance: 50,
                // 线条的粗细
                strength: 1
            },
        },
      },
      theme: {
        edge: {
          type: 'Straight',
          arrow: true,
          arrowPosition: 0.8,
        }
      }
    });
    // setTimeout(() => {
    //   this.canvas.draw(mockData);
    // }, 500);
    // console.log(mockData);
    this.canvas.draw(data);

    this.canvas.on('events', (data) => {
      console.log(data);
    });
  }
  render() {
    return (
      <div className='fruchterman-tree-page'>
        <div className="fruchterman-tree-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = Grid;
