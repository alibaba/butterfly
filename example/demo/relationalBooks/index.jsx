import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Canvas from './canvas';
import mockData from './data.js';

import './index.less';
import './iconfont.css';
import 'butterfly-dag/dist/index.css';

class RelationalBook extends Component {
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
      theme: {
        edge: {
          shapeType: 'AdvancedBezier',
        },
      }
    });
    this.canvas.setMinimap(true);
    this.canvas.draw(mockData, () => {
      this.canvas.focusCenterWithAnimate();
    });
  }
  render() {
    return (
      <div className='relational-books-page'>
        <div className="flow-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

ReactDOM.render(<RelationalBook />, document.getElementById('root'));
