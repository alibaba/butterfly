'use strict';
import React, { Component } from 'react';
require('./index.less');
require('butterfly-dag/dist/index.css');

const Canvas = require('./circleCanvas.js');
const Edge = require('./edge.js');
const mockData = require('./data.js');

class Circle extends Component {
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
      layout: {
        type: 'circleLayout',
        options: {
          radius: 100,
          getWidth: () => {
            return 15;
          },
          getHeight: () => {
            return 15;
          },
          
        },
      },
      theme: {
        edge: {
          type: 'Straight'
        }
      }
    });

    this.canvas.draw(mockData, () => {
      this.canvas.focusCenterWithAnimate();
    });
    this.canvas.on('system.link.connect', ({ links }) => {
      links.forEach(link => {
        link.targetNode.active && link.targetNode.active(link.targetNode.dom)
      })
    });
    // 节点点击事件
    this.canvas.on('clickCircleNode', (event) => {
      this.canvas.addEdge({
        id: 3,
        source: 'centerNode',
        target: 13,
        Class: Edge
      });
    })
    // 左箭头点击事件
    this.canvas.on('clickArrowLeft', (event) => {
      console.log(event, 'left')
    })
    // 右箭头点击事件
    this.canvas.on('clickArrowRight', (event) => {
      console.log(event, 'right')
    })
  }
  render() {
    return (
      <div className='circle-page'>
        <div className="circle-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = Circle;
