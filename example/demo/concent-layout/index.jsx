import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Canvas} from 'butterfly-dag';

import mockData from './data.js';

import './index.less';
import 'butterfly-dag/dist/index.css';
class ConcentLayout extends Component {
  constructor() {
    super();
    this.canvas = null;
  }

  componentDidMount() {
    let root = document.getElementById('dag-canvas');
    this.canvas = new Canvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: false,    // 可连线
      draggable: true,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
      layout: {
        type: 'concentricLayout',
        options: {
          maxLevelDiff: 0.5,
          sortBy: 'degree',
          minNodeSpacing: 40,
          preventOverlap: true,
        },
      },
    });
    this.canvas.draw(mockData);
  }

  render() {
    return (
      <div className='concentLayout-page'>
        <div className="flow-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

ReactDOM.render(<ConcentLayout />, document.getElementById('root'));
