'use strict';
import React, {Component} from 'react';
require('./index.less');
const Node = require('./node.js');

const Canvas = require('../../../index.js').TreeCanvas;
const mockData = {
  nodes: {
    isRoot: true,
    id: 'Root',
    title: '根节点',
    content: 'root',
    color: 'purple',
    Class: Node,
    endpoints: [{
      id: '1',
      orientation: [0, 1],
      pos: [0.5, 0]
    }],
    children: [{
      id: 'subNode1',
      Class: Node,
      title: '子节点 1',
      content: 'sub node 1',
      color: 'drak-blue',
      // collapsed: true,
      endpoints: [{
        id: '1',
        orientation: [0,- 1],
        pos: [0.5, 0]
      }, {
        id: '2',
        orientation: [0, 1],
        pos: [0.5, 0]
      }],
      children: [{
        id: 'subNode1-1',
        Class: Node,
        title: '子节点 1-1',
        content: 'sub node 1-1',
        color: 'blue',
        endpoints: [{
          id: '1',
          orientation: [0,- 1],
          pos: [0.5, 0]
        }, {
          id: '2',
          orientation: [0, 1],
          pos: [0.5, 0]
        }]
      }, {
        id: 'subNode1-2',
        Class: Node,
        title: '子节点 1-2',
        content: 'sub node 1-2',
        color: 'blue',
        endpoints: [{
          id: '1',
          orientation: [0,- 1],
          pos: [0.5, 0]
        }, {
          id: '2',
          orientation: [0, 1],
          pos: [0.5, 0]
        }]
      }]
    }, {
      id: 'subNode2',
      Class: Node,
      title: '子节点 2',
      content: 'sub node 2',
      color: 'blue',
      // collapsed: true,
      endpoints: [{
        id: '1',
        orientation: [0,- 1],
        pos: [0.5, 0]
      }, {
        id: '2',
        orientation: [0, 1],
        pos: [0.5, 0]
      }],
      children: [{
        id: 'subNode2-1',
        Class: Node,
        title: '子节点 2-1',
        content: 'sub node 2-1',
        color: 'blue',
        endpoints: [{
          id: '1',
          orientation: [0,- 1],
          pos: [0.5, 0]
        }, {
          id: '2',
          orientation: [0, 1],
          pos: [0.5, 0]
        }]
      }, {
        id: 'subNode2-2',
        Class: Node,
        title: '子节点 2-2',
        content: 'sub node 2-2',
        color: 'blue',
        endpoints: [{
          id: '1',
          orientation: [0,- 1],
          pos: [0.5, 0]
        }, {
          id: '2',
          orientation: [0, 1],
          pos: [0.5, 0]
        }]
      }]
    }, {
      id: 'subNode3',
      Class: Node,
      title: '子节点 3',
      content: 'sub node 3',
      color: 'blue',
      endpoints: [{
        id: '1',
        orientation: [0,- 1],
        pos: [0.5, 0]
      }, {
        id: '2',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    }]
  },
  edges: [{
    id: '0',
    source: '1',
    target: '1',
    sourceNode: 'Root',
    targetNode: 'subNode1',
    type: 'endpoint'
  }, {
    id: '1',
    source: '1',
    target: '1',
    sourceNode: 'Root',
    targetNode: 'subNode2',
    type: 'endpoint'
  }, {
    id: '2',
    source: '1',
    target: '1',
    sourceNode: 'Root',
    targetNode: 'subNode3',
    type: 'endpoint'
  }, {
    id: '3',
    source: '2',
    target: '1',
    sourceNode: 'subNode1',
    targetNode: 'subNode1-1',
    type: 'endpoint'
  }, {
    id: '4',
    source: '2',
    target: '1',
    sourceNode: 'subNode1',
    targetNode: 'subNode1-2',
    type: 'endpoint'
  }, {
    id: '5',
    source: '2',
    target: '1',
    sourceNode: 'subNode2',
    targetNode: 'subNode2-1',
    type: 'endpoint'
  }, {
    id: '6',
    source: '2',
    target: '1',
    sourceNode: 'subNode2',
    targetNode: 'subNode2-2',
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
          type: 'Manhattan',
          arrow: true
        }
      },
      layout: {
        type: 'compactBox',
        options: {
          direction: 'TB',
          getHeight(d) {
            return 60;
          },
          getWidth(d) {
            return 120;
          },
          getHGap(d) {
            return 20;
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
    this.canvas.on('events', (data) => {
      console.log(data);
    });
  }
  render() {
    return (
      <div className='compactBoxTree-page'>
        <div className="compactBoxTree-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

module.exports = compactBoxTree;
