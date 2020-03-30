'use strict';
import React, {Component} from 'react';
require('./index.less');

const Canvas = require('../../../index.js').Canvas;
const mockData = require('./data');

class Diodes extends Component {
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
          defaultAnimate: true
        }
      }
    });
    this.canvas.draw(mockData, () => {
    });
    this.canvas.on('events', (data) => {
      // console.log(data);
    });
  }
  unDo() {
    this.canvas.undo();
  }
  reDo() {
    this.canvas.redo();
  }
  render() {
    return (
      <div className='diodes-page'>
        <button className='undo-btn' onClick={this.unDo.bind(this)}>undo</button>
        <button className='redo-btn' onClick={this.reDo.bind(this)}>redo</button>
        <div className="diodes-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = Diodes;
