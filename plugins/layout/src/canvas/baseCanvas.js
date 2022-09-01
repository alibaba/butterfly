'use strict';

// import BaseCanvas from '../../../../src/canvas/baseCanvas';
import {Canvas} from 'butterfly-dag';
import $ from 'jquery';

class KedrovizCanvas extends Canvas {
  constructor(opts) {
    super(opts);
    this.layer = null;
    const drawPath = _.get(opts, 'drawPath');

    if (drawPath && _.isFunction(drawPath)) {
      this.drawPath = drawPath;
    }

    this._edgeCage = {};
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

    this.drawPath({nodes: this.nodes, edges: this.edges, layout: this.layout});


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
    _newLayers._init({
      _coordinateService: this._coordinateService
    });
    _layersFragment.appendChild(_newLayers.dom);
    $(this.wrapper).append(_layersFragment);
    this.layer = _newLayers;
  }
  
  _addEventListener() {
    super._addEventListener();
    this.on('custom', (edge) => {
      if(edge.type === 'edge:calcPath') {
        let _edge = (edge && edge.data) || {};

        // 防止重复计算避障
        let cacheEdge = this._edgeCage[_edge.id];
        if (cacheEdge) {
          if (_edge.sourceNode.top === cacheEdge.source.y && _edge.sourceNode.left === cacheEdge.source.x && _edge.sourceNode.width === cacheEdge.source.w && _edge.sourceNode.height === cacheEdge.source.h
            && _edge.targetNode.top === cacheEdge.target.y && _edge.targetNode.left === cacheEdge.target.x && _edge.targetNode.width === cacheEdge.target.w && _edge.targetNode.height === cacheEdge.target.h) {
            return;
          }
        }
        this.drawPath({nodes: this.nodes, edges: this.edges, layout: this.layout});

        this._edgeCage = {};
        this.edges.forEach((item) => {
          this._edgeCage[item.id] = {
            source: {
              x: item.sourceNode.left,
              y: item.sourceNode.top,
              w: item.sourceNode.width,
              h: item.sourceNode.height
            },
            target: {
              x: item.targetNode.left,
              y: item.targetNode.top,
              w: item.targetNode.width,
              h: item.targetNode.height
            },
            d: item.d
          }
        });
      }
    });
    this.on('events', (data) => {
      if (data.type === 'system.canvas.move' || data.type === 'canvas.zoom') {
        this.layer.updateLayerName();
      }
    });
  }
}

export default KedrovizCanvas;
