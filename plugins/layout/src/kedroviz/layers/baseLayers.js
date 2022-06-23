"use strict";
import { getLayers } from "../selectors/layers";
const $ = require('jquery');
const _ = require("lodash");
import "./baseLayers.less";
const EventEmit3 = require('eventemitter3');

class BaseLayers extends EventEmit3 {
  constructor(opts) {
    super(opts);
    this.rankdir = opts.layout && opts.layout.options && opts.layout.options.rankdir || "TB";
    this.direction = (this.rankdir === 'TB' || this.rankdir === 'BT') ? 'column' : 'row';
    this.layers = getLayers({ nodes: opts.nodes, edges: opts.edges, layers: opts.layers || [], direction: this.direction });
    this.el = {};
    this.dom = null;
    this.visible = opts.layout && opts.layout.options && opts.layout.options.visible || true;
  }


  _init() {
    this.dom = this.draw();
  }


  draw() {
    let _dom = $("<div></div>").attr("class", "butterfly-layers");
    let layer = $(_dom);
    let layersDom = $(`<div class="butterfly-flowchart__layers"></div>`);
    layer.append(layersDom);
    let layersNameDom = $(`<ul></ul>`)
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
      this.drawLayerNames(layer[0]);
    }
    return layer[0];
  }

  drawLayers(layer) {
    let layers = this.layers;
    let layersDom = $(layer).find('.butterfly-flowchart__layers');
    for (let i=0;i<layers.length;i++){
      let dom = $(`<div class='butterfly-layer'style="top: ${layers[i].y}px;left: ${layers[i].x}px; height: ${layers[i].height}px; width: ${layers[i].width}px;" ></div>`);
      layersDom.append(dom);
    }
  };

  drawLayerNames(layer) {
    let layers = this.layers;
    let layerNameDom = $(layer).find('.butterfly-flowchart__layer-names');
    for (let i=0;i<layers.length;i++){
      let dom;
      if(this.direction === 'column') {
        let updateY = (layers[i].y + layers[i].height / 2);
        dom = $(`<li class='butterfly-layer-name' style='opacity: 1;transform: translateY(${updateY}px);'>${layers[i].name}</li>`);
      } else {
        let updateX = (layers[i].x + layers[i].width / 2);
        dom = $(`<li class='butterfly-layer-name' style='opacity: 1;transform: translateX(${updateX}px);'>${layers[i].name}</li>`);
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
