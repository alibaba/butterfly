"use strict";
import { getLayers } from "../selectors/layers";
import $ from 'jquery';
import _ from 'lodash';
import "./baseLayers.less";
import EventEmit3 from 'eventemitter3';

class BaseLayers extends EventEmit3 {
  constructor(opts) {
    super(opts);
    this.rankdir = opts.layout && opts.layout.options && opts.layout.options.rankdir || "RL";
    this.direction = (this.rankdir === 'TB' || this.rankdir === 'BT') ? 'column' : 'row';
    this.layoutOptions = opts;
    this.el = {};
    this.dom = null;
    this.visible = opts.layout && opts.layout.options && opts.layout.options.visible || true;
  }

  _init() {
    this.dom = this.draw(this.layoutOptions);
  }

  draw(layers) {
    this.layers = getLayers({ nodes: layers.nodes, edges: layers.edges, layers: layers.layers || [], direction: this.direction });
    let _dom = $("<div></div>").attr("class", "butterfly-layers");
    let layer = $(_dom);
    let layersDom = $(`<div class="butterfly-flowchart__layers"></div>`);
    layer.append(layersDom);
    let layersNameDom = $(`<ul style='height: ${this.layers.length && this.layers[0].height}px;'></ul>`)
      .attr(
        "class",
        `butterfly-flowchart__layer-names ${
          this.layers.length === 0
            ? ""
            : "butterfly-flowchart__layer-names--visible"
        }`
      );
    layer.append(layersNameDom);
    if(this.visible) {
      this.drawLayers(layer[0]);
      this.drawLayerNames(layer[0],layers.nodes);
    }
    return layer[0];
  }

  redraw(layers) {
    if (this.dom) {
      $(this.dom).off();
      $(this.dom).remove();
    }
    this.dom = this.draw(layers);
    this.selectD3Elements();
  }

  drawLayers(layer) {
    let layers = this.layers;
    let layersDom = $(layer).find('.butterfly-flowchart__layers');
    for (let i=0;i<layers.length;i++){
      let label = '';
      if (layers[i].name === 'APP') {
        label = 'app';
      } else if (layers[i].name === 'API') {
        label = 'api';
      } else if (layers[i].name === '逻辑表') {
        label = 'physical-table';
      } else {
        label = layerItem;
      }
      let dom = $(`<div class='butterfly-layer butterfly-layer-${label}'style="top: ${layers[i].y}px;left: ${layers[i].x}px; height: ${layers[i].height}px; width: ${layers[i].width}px;" ></div>`);
      layersDom.append(dom);
    }
  };

  drawLayerNames(layer, nodes) {
    let layers = this.layers;
    let minNode = Infinity;
    nodes.forEach(item => {
      if (item.top < minNode) {
        minNode = item.top;
      }
    });
    let layerNameDom = $(layer).find('.butterfly-flowchart__layer-names');
    for (let i=0;i<layers.length;i++){
      let dom;
      if(this.direction === 'column') {
        let updateY = (layers[i].y + layers[i].height / 2);
        dom = $(`<li class='butterfly-layer-name' style='opacity: 1;transform: translateY(${updateY}px);'>${layers[i].name}</li>`);
      } else {
        let updateX = (layers[i].x + layers[i].width / 2);
        dom = $(`<li class='butterfly-layer-name' style='opacity: 1;transform: translateX(${updateX}px) translateY(${minNode - 150}px)'>${layers[i].name}</li>`);
      }
      layerNameDom.append(dom);
    }
  };

  selectD3Elements() {
    this.el = {
      layerGroup: this.dom && $('.butterfly-flowchart__layers'),
      layerNameGroup: this.dom && $('.butterfly-flowchart__layer-names'),
    };
  }
}

export default BaseLayers;
