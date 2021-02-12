import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Canvas } from 'butterfly-dag';
import mockData from './data.js';

import './index.less';

class Scene4New extends Component {
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
          type: 'Straight',
        }
      }
    });
    this.canvas.draw(mockData);
    this.canvas.on('events', (data) => {
      console.log(data);
    });
  }

  render() {
    return (
      <div className='analysis'>
        <div className="analysis-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Scene4New />, rootElement);
