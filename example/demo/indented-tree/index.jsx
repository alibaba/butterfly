'use strict';
import React, {Component} from 'react';
require('./index.less');
const Node = require('./node.js');
const $ = require('jquery');

const Canvas = require('../../../index.js').TreeCanvas;
const mockData = {
  nodes: {
    id: '0',
    isRoot: true,
    condition: 'and',
    desc: '企业经营异常记录数',
    Class: Node,
    endpoints: [{
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }, {
      id: 'bottom',
      orientation: [0, 1],
      pos: [0.5, 0]
    }],
    children: [{
      id: '1',
      condition: 'and',
      Class: Node,
      desc: '请选择指标',
      endpoints: [{
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }],
      children: [{
        id: '2',
        desc: '请选择指标',
        Class: Node,
        endpoints: [{
          id: 'left',
          orientation: [-1, 0],
          pos: [0, 0.5]
        }, {
          id: 'bottom',
          orientation: [0, 1],
          pos: [0.5, 0]
        }],
      }]
    }]
  },
  edges: [{
    id: '0',
    source: 'bottom',
    target: 'left',
    sourceNode: '0',
    targetNode: '1',
    type: 'endpoint'
  }, {
    id: '1',
    source: 'bottom',
    target: 'left',
    sourceNode: '1',
    targetNode: '2',
    type: 'endpoint'
  }]
};

class IndentedTree extends Component {
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
          type: 'Manhattan'
        }
      },
      layout: {
        type: 'indented',
        options: {
          direction: 'LR',
          isHorizontal: true,
          indent: 80,
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth() {
            return 16;
          }
        }
      }
    });
    this.canvas.draw(mockData, {}, () => {
      this.canvas.focusCenterWithAnimate();
    });

    let _tmpNum = 100;
    this.canvas.on('events', (data) => {
      console.log(data);
      if (data.type === 'custom:addSubNode') {
        // addNode，removeNode可以还需要重写下
        this.canvas.addNode({
          id: _tmpNum.toString(),
          text: `我是id为${_tmpNum}的节点`,
          parent: data.data.parent,
          Class: Node,
          condition: 'and',
          desc: '请选择指标',
          endpoints: [{
            id: 'left',
            orientation: [-1, 0],
            pos: [0, 0.5]
          }, {
            id: 'bottom',
            orientation: [0, 1],
            pos: [0.5, 0]
          }],
        });
        this.canvas.addEdge({
          id: this.canvas.edges.length.toString(),
          source: 'bottom',
          target: 'left',
          sourceNode: data.data.parent,
          targetNode: (_tmpNum++).toString(),
          type: 'endpoint'
        });
        this.canvas.redraw();
      }
    });

  }
  render() {
    return (
      <div className='indented-tree-page'>
        <div className="indented-tree-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = IndentedTree;
