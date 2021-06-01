import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Canvas} from 'butterfly-dag';
import mockData from './data.js';

import 'butterfly-dag/dist/index.css';
import './iconfont.css';
import './index.less';

class LoginNew extends Component {
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
          shapeType: 'AdvancedBezier',
        }
      }
    });
    this.canvas.draw(mockData);
  }
  render() {
    return (
      <div className='login'>
        <div className="login-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

ReactDOM.render(<LoginNew />, document.getElementById('root'));
