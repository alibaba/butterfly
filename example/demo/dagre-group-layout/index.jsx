import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import mockData from './data';
import {Canvas} from 'butterfly-dag';
// import {Canvas} from 'local::butterfly-dag'; // 引用本地数据时使用

import './index.less';
import 'antd/dist/antd.css';
import 'butterfly-dag/dist/index.css';

class DagreGroupLayout extends Component {
  constructor() {
    super();
    this.canvas = null;
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
      layout: {
        type: 'dagreGroupLayout',
        options: {
          rankdir: 'TB',
          nodesep: 40,
          ranksep: 50,
          controlPoints: false,
        },
      },
      theme: {
        edge: {
          shapeType: 'AdvancedBezier',
          arrow: true,
          arrowPosition: 0.5
        }
      }
    });
    this.canvas.draw(mockData);
  }

  render() {
    return (
      <div className='dagre-group'>
        <div className="dagre-group-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

ReactDOM.render(<DagreGroupLayout />, document.getElementById('root'));
