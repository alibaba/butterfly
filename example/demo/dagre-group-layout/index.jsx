import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Select, Slider} from 'antd';

import mockData from './data';
import {Canvas} from 'local::butterfly-dag';

import './index.less';
import 'antd/dist/antd.css';
import 'butterfly-dag/dist/index.css';

const Option = Select.Option;
class DagreLayout extends Component {
  constructor() {
    super();
    this.canvas = null;
    this.state = {
      addNodesStatus: true
    };
  }

  componentDidMount() {
    let root = document.getElementById('dag-canvas');
    console.log('Canvas: ', Canvas);
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

ReactDOM.render(<DagreLayout />, document.getElementById('root'));
