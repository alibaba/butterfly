import React from 'react';
import ReactDOM from 'react-dom';
import {Canvas} from 'butterfly-dag';

import mockData from './data';

import './index.less';
import 'butterfly-dag/dist/index.css';

class Flow extends React.Component {
  constructor() {
    super();
    this.canvas = null;
  }

  componentDidMount() {
    // css里面的类名限制太死了
    let root = document.getElementById('dag-canvas');
    this.canvas = new Canvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: false,    // 可连线
      draggable: true,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
      theme: {
        edge: {
          shapeType: 'AdvancedBezier',
        }
      }
    });
    this.canvas.draw(mockData);
  }

  render() {
    return (
      <div className='flow-page'>
        <div className="flow-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Flow />, document.getElementById('root'));
