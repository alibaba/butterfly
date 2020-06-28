'use strict';
import React, {Component} from 'react';
require('./index.less');
const Node = require('./node.js');

const Canvas = require('../../../index.js').TreeCanvas;
const mockData = {
  nodes: {
    id: '0',
    isRoot: true,
    text: '半年内企业经营异常记录数',
    color: 'green',
    Class: Node,
    endpoints: [{
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }, {
      id: 'right',
      orientation: [1, 0],
      pos: [0, 0.5]
    }],
    children: [{
      id: '1',
      color: 'red',
      text: '小于或等于 5',
      Class: Node,
      endpoints: [{
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }, {
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }],
      children: [{
        id: '3',
        color: 'green',
        text: '企业是否吊销',
        Class: Node,
        endpoints: [{
          id: 'left',
          orientation: [-1, 0],
          pos: [0, 0.5]
        }, {
          id: 'right',
          orientation: [1, 0],
          pos: [0, 0.5]
        }],
        children: [{
          id: '4',
          color: 'red',
          text: '等于 是',
          Class: Node,
          endpoints: [{
            id: 'left',
            orientation: [-1, 0],
            pos: [0, 0.5]
          }, {
            id: 'right',
            orientation: [1, 0],
            pos: [0, 0.5]
          }],
          children: [{
            id: '6',
            color: 'blue',
            text: '赋值 xxx',
            Class: Node,
            endpoints: [{
              id: 'left',
              orientation: [-1, 0],
              pos: [0, 0.5]
            }, {
              id: 'right',
              orientation: [1, 0],
              pos: [0, 0.5]
            }],
          }]
        }, {
          id: '5',
          color: 'red',
          text: '等于 否',
          Class: Node,
          endpoints: [{
            id: 'left',
            orientation: [-1, 0],
            pos: [0, 0.5]
          }, {
            id: 'right',
            orientation: [1, 0],
            pos: [0, 0.5]
          }],
          children: [{
            id: '7',
            color: 'blue',
            text: '赋值 xxx',
            Class: Node,
            endpoints: [{
              id: 'left',
              orientation: [-1, 0],
              pos: [0, 0.5]
            }, {
              id: 'right',
              orientation: [1, 0],
              pos: [0, 0.5]
            }],
          }]
        }]
      }]
    }, {
      id: '2',
      color: 'red',
      text: '大于 5',
      Class: Node,
      endpoints: [{
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }, {
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }],
      children: [{
        id: '8',
        color: 'blue',
        text: '赋值 xxx',
        Class: Node,
        endpoints: [{
          id: 'left',
          orientation: [-1, 0],
          pos: [0, 0.5]
        }, {
          id: 'right',
          orientation: [1, 0],
          pos: [0, 0.5]
        }],
      }]
    }]
  },
  edges: [{
    id: '0',
    source: 'right',
    target: 'left',
    sourceNode: '0',
    targetNode: '1',
    type: 'endpoint'
  }, {
    id: '1',
    source: 'right',
    target: 'left',
    sourceNode: '0',
    targetNode: '2',
    type: 'endpoint'
  }, {
    id: '2',
    source: 'right',
    target: 'left',
    sourceNode: '1',
    targetNode: '3',
    type: 'endpoint'
  }, {
    id: '3',
    source: 'right',
    target: 'left',
    sourceNode: '3',
    targetNode: '4',
    type: 'endpoint'
  }, {
    id: '4',
    source: 'right',
    target: 'left',
    sourceNode: '3',
    targetNode: '5',
    type: 'endpoint'
  }, {
    id: '5',
    source: 'right',
    target: 'left',
    sourceNode: '4',
    targetNode: '6',
    type: 'endpoint'
  }, {
    id: '6',
    source: 'right',
    target: 'left',
    sourceNode: '5',
    targetNode: '7',
    type: 'endpoint'
  }, {
    id: '6',
    source: 'right',
    target: 'left',
    sourceNode: '2',
    targetNode: '8',
    type: 'endpoint'
  }]
};

class compactBoxTree extends Component {
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
          arrow: true
        }
      },
      layout: {
        type: 'compactBox',
        options: {
          direction: 'LR',
          getHeight(d) {
            return 60;
          },
          getWidth(d) {
            return 180;
          },
          getHGap(d) {
            return 80;
          },
          getVGap(d) {
            return 80;
          },
        }
      }
    });
    this.canvas.draw(mockData, {}, () => {
      this.canvas.focusCenterWithAnimate();
    });
    let _tmpNum = 100;
    this.canvas.on('events', (data) => {
      if (data.type === 'custom:addSubNode') {
        // addNode，removeNode可以还需要重写下
        this.canvas.addNode({
          id: _tmpNum.toString(),
          text: `我是id为${_tmpNum}的节点`,
          parent: data.data.parent,
          Class: Node,
          endpoints: [{
            id: 'left',
            orientation: [-1, 0],
            pos: [0, 0.5]
          }, {
            id: 'right',
            orientation: [1, 0],
            pos: [0, 0.5]
          }],
        });
        this.canvas.addEdge({
          id: this.canvas.edges.length.toString(),
          source: 'right',
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
      <div className='ruleTree-page'>
        <div className="ruleTree-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = compactBoxTree;
