'use strict';
import React, {Component} from 'react';

import './index.less';
import 'butterfly-dag/dist/index.css';
import { Canvas } from 'butterfly-dag';
import mockData from './data';
class System extends Component {
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
          shapeType: 'Straight'
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
      <div className='system-page'>
        <div className="system-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

export default System;
