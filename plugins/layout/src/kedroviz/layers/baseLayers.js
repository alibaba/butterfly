"use strict";
import { getLayers } from "../selectors/layers";
const $ = require('jquery');
const _ = require("lodash");
import "./baseLayers.less";
const EventEmit3 = require('eventemitter3');
// import {toggleLayers} from '../data/normalize-data';

class BaseLayers extends EventEmit3 {
  constructor(opts) {
    super(opts);
    this.layers = getLayers({ nodes: opts.nodes, edges: opts.edges, layers: opts.layers });
    this.el = {};
    this.dom = null;
    this.visible = opts.layers.visible;
  }


  _init() {
    this.dom = this.draw();
  }


  draw() {
    let _dom = $("<div></div>").attr("class", "butterfly-layers");
    let layer = $(_dom);
    // let icon = $(`
    // <div class="butterfly-layers-button">
    //   ${this.visible ? '展示' : '隐藏'}分组
    // </div>
    // `).on('click', (e) => {
    //   this.onToggleLayers();
    // });
    // layer.append(icon);
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
      let updateY = (layers[i].y + layers[i].height / 2);
      let dom = $(`<li class='butterfly-layer-name' style='opacity: 1;transform: translateY(${updateY}px);'>${layers[i].name}</li>`)
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
