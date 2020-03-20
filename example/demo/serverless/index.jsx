'use strict';
import React, {Component} from 'react';

require('./index.less');
require('butterfly-dag/dist/index.css');

const Canvas = require('../../../index.js').Canvas;

const mockData = require('./data');

class Serverless extends Component {
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
          type: 'AdvancedBezier',
          // type: 'Flowchart'
          // label: 'test'
          // label: $('<div class="edge-label"><div class="new-btn">+</div></div>')[0],
          arrow: true
        },
        endpoint: {
          style: {
            fill: '#8fa4ae',
            stroke: '#8fa4ae',
            radius: 3,
            'stroke-width': 1
          },
          hover: {
            fill: '#20c1dc',
            stroke: '#20c1dc'
          },
          position: ['Top', 'Bottom', 'Left', 'Right'],
          linkableHighlight: true
        }
      }
    });

    mockData.nodes.forEach((item) => {
      let endpoints = item.endpoints;
      let sourceE = endpoints.filter((item) => {
        return item.type === 'source';
      });
      let targetE = endpoints.filter((item) => {
        return item.type === 'target';
      });

      sourceE.forEach((e, index) => {
        if (e.type === 'source') {
          e.orientation = [0, 1];
        } else {
          e.orientation = [0, -1];
        }
        e.pos = [(index + 1) / (sourceE.length + 1), 0];
      });
      targetE.forEach((e, index) => {
        if (e.type === 'source') {
          e.orientation = [0, 1];
        } else {
          e.orientation = [0, -1];
        }
        e.pos = [(index + 1) / (targetE.length + 1), 0];
      });
    });
    this.canvas.draw(mockData, () => {

    });

    // test
    // this.canvas.on('events', (data) => {
    //   let node1 = this.canvas.nodes[0];
    //   node1.addNewSourceEndpoint();
    //   console.log(data);
    // });

    // setTimeout(() => {
    //   let node1 = this.canvas.nodes[0];
    //   let node2 = this.canvas.nodes[1];
    //   this.canvas.addGroup({
    //     id: 'group_2'
    //   }, [node1, node2], {
    //     posType: 'absolute',
    //     padding: 30
    //   });
    // }, 3000);
  }
  render() {
    return (
      <div className='serverless-page'>
        <div className="base-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = Serverless;
