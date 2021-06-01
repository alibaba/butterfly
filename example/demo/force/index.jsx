import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Canvas} from 'butterfly-dag';
import mockData from './data';

import 'butterfly-dag/dist/index.css';
import './index.less';

class ForceTree extends Component {
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
        type: 'forceLayout',
        options: {
          link: {
            // 线条的距离
            distance: 50,
            // 线条的粗细
            strength: 1
          },
        },
      },
      theme: {
        edge: {
          shapeType: 'Straight'
        }
      }
    });
    this.canvas.draw(mockData);
  }
  render() {
    return (
      <div className='force-tree-page'>
        <div className="force-tree-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

ReactDOM.render(<ForceTree />, document.getElementById('root'));
