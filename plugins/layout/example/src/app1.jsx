import React, {Component} from 'react';
import $ from 'jquery';
import { Canvas, Node, Edge } from '../../../../index';
import './app1.less';
import '../../../../static/butterfly.css';
const treeData = require('./mock_data1.json');
import {kedrovizLayout, KedrovizEdge, BaseLayers, obstacleAvoidancePoints} from 'butterfly-plugins-layout';
import 'butterfly-plugins-layout/dist/index.css';
// import obstacleAvoidancePoints from '../../src/edgeTypes/kedrovizEdge/obstacleAvoidancePoints';
// import {kedrovizLayout, BaseLayers} from '../../../../plugins/layout/src/kedroviz';
// import KedrovizEdge from '../../src/edgeTypes/kedrovizEdge/KedrovizEdge';

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw (opts) {
    const container = $('<div class="kedroviz-base-node"></div>')
                    .attr('id', opts.id)
                    .css('top', opts.top + 'px')
                    .css('left', (opts.left) + 'px')
                    .css('width', opts.options.width + 'px')
                    .css('height', opts.options.height + 'px');
    $('<span class="tmpText"></span>').text(this.options.name).appendTo(container);


    return container[0];
  }
}

class Scene extends Component {
  componentDidMount() {
    let root = document.getElementById('dag-canvas');
    this.canvas = new Canvas({
      root: root,
      disLinkable: false, // 可删除连线
      layout: {type: kedrovizLayout, options: {rankdir: 'LR', visible: true, Class: BaseLayers}},
      linkable: true,    // 可连线
      draggable: false,   // 可拖动
      zoomable: true,    // 可放大
      moveable: true,    // 可平移
      theme: {
      },
      avoidPoints: obstacleAvoidancePoints
    });
    // 数据格式转换
    const nodes = treeData.nodes.map(n => {
      const res = {};
      res.draggable = true;
      res.id = n.id;
      res.name = n.name;
      res.Class = BaseNode;
      res.layer = n.layer;
      res.draggable = false;
      res.width = n.width;
      res.height = n.height;
      // res.endpoints = [{
      //   id: 'down',
      //   orientation: [0, 1],
      //   pos: [0.5, 1]
      // }, {
      //   id: 'up',
      //   orientation: [0, -1],
      //   pos: [0.5, 1]
      // }];
      return res;
    });
    const edges = treeData.edges.map(e => {
      const res = {};
      // res.type = 'endpoint';
      // res.source = 'down';
      // res.target = 'up';
      res.type = 'node';
      res.source = e.source;
      res.target = e.target;
      // res.sourceNode = e.source;
      // res.targetNode = e.target;
      res.arrow = true;
      res.arrowPosition = 1;
      res.Class = KedrovizEdge;
      return res;
    });

    this.canvas.draw({nodes, edges, layers: treeData.layers}, () => {

    });
    this.canvas.on('events', (data) => {
    });
  }
  render() {
    return (
      <div className='kedroviz'>
        <div className="kedroviz-canvas" id="dag-canvas">
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
