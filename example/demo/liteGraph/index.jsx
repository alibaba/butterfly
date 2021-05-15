'use strict'
import React, {Component} from 'react';
import mockData from './data.js'
import './index.less';
import { Canvas } from 'butterfly-dag';
// import { Canvas } from '../../../index.js';
import $ from 'jquery';
class LiteGraph extends Component{
  constructor(){
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
            shapeType: 'AdvancedBezier'
          }
        }
    })
    this.canvas.draw(mockData, () => {
      this.canvas.setGridMode(true, {
        isAdsorb: false,         // 是否自动吸附,默认关闭
        theme: {
          shapeType: 'circle',     // 展示的类型，支持line & circle
          gap: 20,               // 网格间隙
          backgroud: '#252525',     // 网格背景颜色
          circleRadiu: 1.5,        // 圆点半径
          circleColor: 'rgba(255, 255, 255, 0.2)'    // 圆点颜色
        }
      });
    });
    this.canvas.on('events', (data) => {
      console.log(data);
    })
  }
  render() {
    return (
      <div className='litegraph-page'>
        <button className='action-btn undo-btn' onClick={() => {this.canvas.undo()}}>undo</button>
        <button className='action-btn redo-btn' onClick={() => {this.canvas.redo()}}>redo</button>
        <div className='litegraph-canvas' id='dag-canvas'></div>
      </div>
    )
  }
}
export default LiteGraph;