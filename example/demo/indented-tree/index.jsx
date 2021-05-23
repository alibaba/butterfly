import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {TreeCanvas} from 'butterfly-dag';
import mockData from './data';
import Node from './node';

import 'butterfly-dag/dist/index.css';
import './iconfont.css';
import './index.less';
class IndentedTree extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    let root = document.getElementById('dag-canvas');

    this.canvas = new TreeCanvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: true,    // 可连线
      draggable: true,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
      theme: {
        edge: {
          shapeType: 'Manhattan'
        }
      },
      layout: {
        type: 'indented',
        options: {
          direction: 'LR',
          isHorizontal: true,
          indent: 160,
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth() {
            return 100;
          }
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
        // TODO :问题在这里
        try {
          this.canvas.redraw();
        } catch (e) {
          console.log(e);
        }
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

ReactDOM.render(<IndentedTree />, document.getElementById('root'));
