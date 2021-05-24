import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {Canvas} from 'butterfly-dag';

// !!! in webpack use below !!!
// import panelPlugins from 'butterfly-dag/plugins/panel/dist/index.js';

import panelPlugins from 'butterfly-dag/plugins/panel/dist/index.unpkg.js';
import 'butterfly-dag/plugins/panel/dist/index.css';

import './index.less';
import 'butterfly-dag/dist/index.css';

class PluginPanel extends Component {
  componentDidMount() {
    let root = document.getElementById('dag-canvas');

    this.canvas = new Canvas({
      root: root,
      disLinkable: true, // 可删除连线
      linkable: true,    // 可连线
      draggable: true,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
    });

    let basicRoot = document.getElementById('basic-panel-content');
    let umlRoot = document.getElementById('uml-panel-content');
    // 注册panel
    panelPlugins.register([
      {
        root: basicRoot,
        canvas: this.canvas,
        type: 'basic',
        width: 40,
        height: 40
      }, {
        root: umlRoot,
        canvas: this.canvas,
        type: 'uml',
        width: 40,
        height: 40
      }
    ]);

    this.canvas.on('system.canvas.click', () => {
      this.canvas.nodes.forEach((item) => {
        item.unfocus && item.unfocus();
      });
    });
  }

  render() {
    return (
      <div className='plugin-panel-page'>
        <div className='plugin-container'>
          <div className="basic-panel">
            <p className="title">基础主题</p>
            <div className="basic-panel-content" id="basic-panel-content"></div>
          </div>
          <div className="uml-panel">
            <p className="title">UML主题</p>
            <div className="uml-panel-content" id="uml-panel-content"></div>
          </div>
        </div>
        <div className="plugin-panel-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

ReactDOM.render(<PluginPanel />, document.getElementById('root'));
