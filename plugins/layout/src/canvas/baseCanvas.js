'use strict';

// import {Edge} from 'butterfly-dag';
import BaseCanvas from '../../../../src/canvas/baseCanvas';
import $ from 'jquery';

class KedrovizCanvas extends BaseCanvas {
  constructor(opts) {
    super(opts);
    const drawPath = _.get(opts, 'drawPath');

    if (drawPath && _.isFunction(drawPath)) {
      this.drawPath = drawPath;
    }
  }

  //===============================
  //[ 画布渲染 ]
  //===============================
  draw(opts, callback) {
    const groups = opts.groups || [];
    const nodes = opts.nodes || [];
    const edges = opts.edges || [];
    const layers = opts.layers || [];

    // 自动布局需要重新review
    if (this.layout && !opts.isNotRelayout) {
      this._autoLayout({
        groups,
        nodes,
        edges,
        layers
      });
    }

    // 计算避障点
    // if(this.drawPath) {
    //   this.drawPath({nodes, edges, layout: this.layout});
    // }

    let drawPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // 生成groups
        this.addGroups(groups);
        resolve();
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 生成nodes
          this.addNodes(nodes);
          resolve();
        }, 10);
      });
    }).then((resolve) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 生成edges
          this.addEdges(edges);
          resolve();
        }, 20);
      });
    });

    if(layers.length !== 0) {
      drawPromise.then((resolve) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // 生成edges
            this.addLayers(layers, nodes, edges, this.layout);
            resolve();
          }, 20);
        });
      });
    }
    
    drawPromise.then(() => {
      this.actionQueue = [];
      this.actionQueueIndex = -1;
      callback && callback({
        nodes: this.nodes,
        edges: this.edges,
        groups: this.groups
      });
      this._hasInited = true;
    });
  }

  //===============================
  //[ layers渲染 ]
  //=============================== 
  addLayers(layers, nodes, edges, layout) {
    const _layersFragment = document.createDocumentFragment();
    const LayersClass = layout.options && layout.options.Class;
    let _newLayers = new LayersClass({ nodes, edges, layers, layout });
    _newLayers._init();
    _layersFragment.appendChild(_newLayers.dom);
    $(this.wrapper).append(_layersFragment);
  }

  _addEventListener() {
    super._addEventListener();
    this.on('custom', (data) => {
      if(data.type === 'edge:calcPath') {
        this.drawPath({nodes: this.nodes, edges: this.edges, layout: this.layout});
      }
    })
  }
}

export default KedrovizCanvas;
