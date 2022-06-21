import React, {Component} from 'react';
import $ from 'jquery';
import { Canvas, Node, Edge } from '../../../../index';
import './app.less';
import '../../../../static/butterfly.css';
const treeData = require('./mock_data.json');
import graphvizLayout, {GraphvizEdge} from '../../src/graphviz/index';
// const {graphvizLayout} = require('../../index');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw (opts) {
    const container = $('<div class="graphviz-base-node"></div>')
                    .attr('id', opts.id)
                    .css('top', opts.top + 'px')
                    .css('left', (opts.left) + 'px')
                    .css('width', opts.options.width)
                    .css('height', opts.options.height);
    $('<span class="tmpText"></span>').text(this.options.label).appendTo(container);

    // this._createTypeIcon(container);
    // this._createText(container);

    return container[0];
  }

  // _createText(dom = this.dom) {
  //   $('<span class="text-box"></span>').text(this.options.label).appendTo(dom);
  // }
}

class Scene extends Component {
  componentDidMount() {
    let root = document.getElementById('dag-canvas');
    this.canvas = new Canvas({
      root: root,
      disLinkable: false, // 可删除连线
      layout: {type: graphvizLayout, options: {}},
      layoutOptions: {rankdir: 'TB'},
      linkable: true,    // 可连线
      draggable: false,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
      theme: {
        edge: {
          arrow: false,
          arrowPosition: 0.3,
          isExpandWidth: true
        }
      }
    });
    // 数据格式转换
    const nodes = treeData.nodes.map(n => {
      const res = {};
      res.draggable = true;
      res.id = n.id;
      res.label = n.name;
      res.Class = BaseNode;
      res.endpoints = [{
        id: 'down',
        orientation: [0, 1],
        pos: [0.5, 1]
      }, {
        id: 'up',
        orientation: [0, -1],
        pos: [0.5, 1]
      }];
      return res;
    });
    const edges = treeData.edges.map(e => {
      const res = {};
      res.type = 'endpoint';
      res.source = 'down';
      res.target = 'up';
      res.sourceNode = e.source;
      res.targetNode = e.target;
      res.arrow = true;
      res.Class = GraphvizEdge;
      return res;
    });

    this.canvas.draw({nodes, edges}, () => {

    });
    this.canvas.on('events', (data) => {
      console.log(data);
    });
  }
  render() {
    return (
      <div className='graphviz'>
        <div className="graphviz-canvas" id="dag-canvas">
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Scene />
    </div>
  );
}

export default App;
