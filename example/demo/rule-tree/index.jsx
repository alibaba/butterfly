import React, {Component} from 'react';
import ReactDom from 'react-dom';
import Custom from './custom.js';
import Node from './node.js';
import $ from 'jquery';
import {TreeCanvas} from 'butterfly-dag';

import './index.less';
import 'antd/dist/antd.css';
import 'butterfly-dag/dist/index.css';


const mockData = {
  nodes: {
    id: '0',
    isRoot: true,
    text: '半年内企业经营异常记录数',
    color: 'green',
    width: parseInt((Math.random() * 500)),
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
      parentId: '0',
      color: 'red',
      text: '小于或等于 5',
      width: parseInt((Math.random() * 500)),
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
        width: parseInt((Math.random() * 500)),
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
          width: parseInt((Math.random() * 500)),
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
            width: parseInt((Math.random() * 500)),
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
          width: parseInt((Math.random() * 500)),
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
            width: parseInt((Math.random() * 500)),
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
      parentId: '0',
      color: 'red',
      text: '大于 5',
      width: parseInt((Math.random() * 500)),
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
        width: parseInt((Math.random() * 500)),
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
const nodesRender = (nodes) => (cb) => {
  const nodelist = [];
  const loop = (list) => {
    list.forEach(node => {
      nodelist.push(node);
      if (node?.children?.length > 0) {
        loop(node.children);
      }
    });
  };
  if (cb && typeof cb === 'function') {
    loop(nodes && [nodes] || []);
    return nodelist.map(cb);
  }
};
class CompactBoxTree extends Component {
  constructor() {
    super();
  }
  state = {
    data: {},
  }
  componentDidMount() {
    let root = document.getElementById('dag-canvas');
    let that = this;
    this.canvas = new TreeCanvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: true,    // 可连线
      draggable: false,   // 可拖动
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
            // console.log(d);
            // console.log(this);
            let node = that.canvas.getNode(d.id);
            if (node) {
              return $(node.dom).width();
            } else {
              return 100;
            }
            // return 180;
          },
          getHGap(d) {
            return 60;
          },
          getVGap(d) {
            return 20;
          },
        }
      }
    });
    this.canvas.draw(mockData, {}, () => {
      this.setState({
        data: mockData
      }, () => {
        this.canvas.focusCenterWithAnimate();
        this.canvas.redraw();
      });
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
        {
          nodesRender(this.state.data.nodes)(
            node => {
              const div = document.getElementById(node.id);
              if (!div) {
                return null;
              }
              return ReactDom.createPortal(
                <Custom key={node.id} node={node} canvas={this.canvas} />,
                div
              );
            }
          )
        }
        <div className="ruleTree-canvas" id="dag-canvas" />
      </div>
    );
  }
}

ReactDom.render(<CompactBoxTree />, document.getElementById('root'));

