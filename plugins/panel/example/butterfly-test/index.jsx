import React, {Component} from 'react';
import BaseCanvas from '../../../../src/canvas/baseCanvas.js';
// import {Canvas as BaseCanvas} from 'butterfly-dag';

import panelPlugins from '../../dist/index.js';
// import panelPlugins from '../../src/index.js';

import pika from '../img/pikatest.jpg';

import pika0 from '../img/pika0.jpg';
import pika1 from '../img/pika1.jpg';
import pika2 from '../img/pika2.jpg';
import pika3 from '../img/pika3.jpg';
import pika4 from '../img/pika4.jpg';

import '../../dist/index.css';
import 'butterfly-dag/dist/index.css';
import './index.less';

class Test extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    let root = document.getElementById('dag-canvas');
    this.canvas = new BaseCanvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: true,    // 可连线
      draggable: true,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
    });

    this.canvas.draw({}, () => {
    });
    this.canvas.on('events', (data) => {
      // console.log(data);
    });
    panelPlugins.register(
      [
        {
          root: document.getElementById('dnd'),
          canvas: this.canvas,
          type: 'uml',
          width: 40,
          height: 40,
          data: [
            {
              id: 'pika',
              type: 'jpg',
              content: pika,
              with: 40,
              height: 40,
            }
          ]
        },
        {
          root: document.getElementById('dnd1'),
          canvas: this.canvas,
          data: [
            {
              id: 'pika0',
              type: 'jpg',
              content: pika0,
              with: 40,
              height: 40,
            },
            {
              id: 'pika1',
              type: 'jpg',
              content: pika1,
              with: 40,
              height: 40,
            },
            {
              id: 'pika2',
              type: 'jpg',
              content: pika2,
              with: 40,
              height: 40,
            },
            {
              id: 'pika3',
              type: 'jpg',
              content: pika3,
              with: 40,
              height: 40,
            },
            {
              id: 'pika4',
              type: 'jpg',
              content: pika4,
              with: 40,
              height: 40,
            },
          ]
        }
      ],
      ()=>{console.log('finish');});
  }
  test = () => {
    let data = this.canvas.getDataMap();
    let node = data.nodes[0];
    node.actived = true;
    node.rotatorDeg = 45;
    node.updata();
    console.log(node);
  }
  render() {
    return (
      <div className='test'>
        <div className="dnd" id='dnd'></div>
        <div className="dnd1" id='dnd1'></div>
        <div className="test-canvas" id="dag-canvas">
        </div>
        <button onClick={this.test}>test</button>
      </div>
    );
  }
}

export default Test;
