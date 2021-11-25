import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {TreeCanvas} from 'butterfly-dag';

import mockData from './data';

import 'butterfly-dag/dist/index.css';
import './index.less';

class CompactBoxTree extends Component {
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
          shapeType: 'Manhattan',
          arrow: true
        }
      },
      layout: {
        type: 'compactBox',
        options: {
          direction: 'TB',
          getHeight(d) {
            return 60;
          },
          getWidth(d) {
            return 120;
          },
          getHGap(d) {
            return 20;
          },
          getVGap(d) {
            return 80;
          },
        }
      }
    });

    this.canvas.draw(mockData, {}, () => {
      this.canvas.focusCenterWithAnimate();
    });
  }

  render() {
    return (
      <div className='compact-box-tree-page'>
        <div className="compact-box-tree-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

ReactDOM.render(<CompactBoxTree />, document.getElementById('root'));

