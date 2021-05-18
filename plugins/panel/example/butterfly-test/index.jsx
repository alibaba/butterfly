import React, {Component} from 'react';
import BaseCanvas from '../../../../src/canvas/baseCanvas.js';
// import {Canvas as BaseCanvas} from 'butterfly-dag';

// import panelPlugins from '../../dist/index.js';
import panelPlugins from '../../src/index.js';

import pika from '../img/pikatest.jpg';

import pika0 from '../img/pika0.jpg';
import pika1 from '../img/pika1.jpg';
import pika2 from '../img/pika2.jpg';
import pika3 from '../img/pika3.jpg';
import pika4 from '../img/pika4.jpg';

// import '../../dist/index.css';
import 'butterfly-dag/dist/index.css';
import './index.less';

let PanelNode = panelPlugins.PanelNode;

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
              width: 40,
              height: 40,
            }
          ]
        },
        {
          root: document.getElementById('dnd1'),
          canvas: this.canvas,
          type: 'routine',
          data: [
            {
              id: 'pika0',
              type: 'jpg',
              content: pika0,
              width: 40,
              height: 40,
            },
            {
              id: 'pika1',
              type: 'jpg',
              content: pika1,
              width: 40,
              height: 40,
            },
            {
              id: 'pika2',
              type: 'jpg',
              content: pika2,
              width: 40,
              height: 40,
            },
            {
              id: 'pika3',
              type: 'jpg',
              content: pika3,
              width: 40,
              height: 40,
            },
            {
              id: 'pika4',
              type: 'jpg',
              content: pika4,
              width: 40,
              height: 40,
            },
            {
              id: 'baidu',
              type: 'png',
              content: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
              width: 100,
              height: 40,
            },
          ]
        }
      ],
      ()=>{console.log('finish')}
    );

    this.canvas.draw(
      {
        nodes: [{
          id: '1',
          top: 10,
          left: 100,
          width: 40,
          height: 40,
          rotate: 45,
          content: 'System-Uml-ClassDiagram-1',
          Class: PanelNode,
        },{
          id: '2',
          top: 10,
          left: 20,
          width: 40,
          height: 40,
          rotate: 30,
          content: 'pika0',
          Class: PanelNode,
        },{
          id: '3',
          top: 100,
          left: 20,
          width: 100,
          height: 40,
          rotate: 30,
          content: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
          Class: PanelNode,
        },{
          id: '4',
          top: 100,
          left: 200,
          width: 40,
          height: 40,
          rotate: 30,
          content: pika4,
          Class: PanelNode,
        }]
      }, () => {
        console.log(this.canvas.getDataMap());
    });
    this.canvas.on('events', (data) => {
      // console.log(data);
    });

  }
  test = () => {
    let data = this.canvas.getDataMap();
    let node = data.nodes[0];
    node.focus();
    node.rotate(-45);
    console.log(node);
    console.log(this.canvas.getDataMap());
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
