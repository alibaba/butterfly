'use strict';
import React, {Component} from 'react';
import './index.less';
import 'butterfly-dag/dist/index.css';
import { Canvas } from '../../../index.js';
// import { Canvas } from 'butterfly-dag';
import mockData from './data';
class Scene4New extends Component {
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
      virtualScroll: {
        enable: true
      },
      theme: {
        edge: {
          shapeType: 'AdvancedBezier',
        },
        // 允许group嵌套
        group: {
          includeGroups: true
        }
      }
    });
    this.canvas.draw(mockData, () => {
      setTimeout(() => {
        this.canvas.removeGroup('group');
        // this.canvas.removeNode('2');
      }, 5000);

    });
    this.canvas.on('events', (data) => {
      // console.log(data);
    });
  }
  render() {
    return (
      <div className='schedule'>
        <button className='action-btn undo-btn' onClick={() => { this.canvas.undo(); }}>undo</button>
        <button className='action-btn redo-btn' onClick={() => { this.canvas.redo(); }}>redo</button>
        <div className="schedule-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}
export default Scene4New;
