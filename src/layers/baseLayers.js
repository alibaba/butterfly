import React, { Component } from "react";
const $ = require("jquery");
const _ = require("lodash");
// import { curveBasis, line } from 'd3-shape';

import Layers from "../interface/layers";

class BaseLayers extends Layers {
  constructor(opts) {
    super(opts);
    this.layers = opts.layers;
    this.layerVisible = opts.layerVisible;
    this.layersRef = React.createRef();
    this.layerNamesRef = React.createRef();
  }

  draw(obj) {
    const { layers } = this.props;
    this.el.layers = this.el.layerGroup
      .selectAll(".butterfly-layer")
      .data(layers, (layer) => layer.id);

    const enterLayers = this.el.layers
      .enter()
      .append("rect")
      .attr("class", "butterfly-layer");

    this.el.layers.exit().remove();

    this.el.layers = this.el.layers.merge(enterLayers);

    this.el.layers
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("height", (d) => d.height)
      .attr("width", (d) => d.width);
  }

  drawLayerNames() {
    const {
      chartSize: { sidebarWidth = 0 },
      layers,
    } = this.props;

    this.el.layerNameGroup
      .transition("layer-names-sidebar-width")
      .duration(this.DURATION)
      .style("transform", `translateX(${sidebarWidth}px)`);

    this.el.layerNames = this.el.layerNameGroup
      .selectAll(".butterfly-layer-name")
      .data(layers, (layer) => layer.id);

    const enterLayerNames = this.el.layerNames
      .enter()
      .append("li")
      .attr("class", "butterfly-layer-name");

    enterLayerNames
      .style("opacity", 0)
      .transition("enter-layer-names")
      .duration(this.DURATION)
      .style("opacity", 1);

    this.el.layerNames
      .exit()
      .style("opacity", 1)
      .transition("exit-layer-names")
      .duration(this.DURATION)
      .style("opacity", 0)
      .remove();

    this.el.layerNames = this.el.layerNames.merge(enterLayerNames);

    this.el.layerNames.text((d) => d.name).attr("dy", 5);
  }

  focus() {}

  unFocus() {}

  _init(obj = {}) {
    if (this._isInited) {
      return;
    }
    // 这里可以抽象下，和constructor对比
    if (obj.left) {
      this.left = obj.left;
    }
    if (obj.top) {
      this.top = obj.top;
    }
    if (obj._isDeleteGroup) {
      this.group = undefined;
      this._group = undefined;
    } else {
      obj.group && (this.group = obj.group);
    }

    delete obj._isDeleteGroup;
    this._isInited = true;
    if (obj.dom) {
      this.dom = obj.dom;
      obj.left && $(this.dom).css("left", `${obj.left}px`);
      obj.top && $(this.dom).css("top", `${obj.top}px`);
    } else {
      this.dom = this.draw(
        _.assign(
          {
            id: this.id,
            top: this.top,
            left: this.left,
            dom: this.dom,
            options: this.options,
          },
          obj
        )
      );
    }
    if (!this._hasEventListener) {
      this._addEventListener();
      this._hasEventListener = true;
    }
  }

  _createEndpoint(isInited) {
    if (isInited) {
      this.endpoints.forEach((item) => this.addEndpoint(item, isInited));
    } else if (this._endpointsData) {
      this._endpointsData.map((item) => this.addEndpoint(item));
    }
  }

  _addEventListener() {
    // todo 做事件代理的形式
    $(this.dom).on("mousedown", (e) => {
      const LEFT_KEY = 0;
      if (e.button !== LEFT_KEY) {
        return;
      }
      if (_.isFunction(this.canMouseDown) && !this.canMouseDown(e)) {
        return;
      }
      if (
        !["SELECT", "INPUT", "RADIO", "CHECKBOX", "TEXTAREA"].includes(
          e.target.nodeName
        )
      ) {
        e.preventDefault();
      }
      if (this.draggable) {
        this._isMoving = true;
        this.emit("InnerEvents", {
          type: "node:dragBegin",
          data: this,
        });
      } else {
        // 单纯为了抛错事件给canvas，为了让canvas的dragtype不为空，不会触发canvas:click事件
        this.emit("InnerEvents", {
          type: "node:mouseDown",
          data: this,
        });
      }
    });

    $(this.dom).on("click", (e) => {
      if (_.isFunction(this.canClick) && !this.canClick(e)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.emit("system.node.click", {
        node: this,
      });
      this.emit("events", {
        type: "node:click",
        node: this,
      });
    });

    this.setDraggable(this.draggable);
  }
  remove() {
    this.emit("InnerEvents", {
      type: "node:delete",
      data: this,
    });
  }
  emit(type, data) {
    super.emit(type, data);
    this._emit(type, data);
  }
  on(type, callback) {
    super.on(type, callback);
    this._on(type, callback);
  }
  destroy(isNotEvent) {
    if (!isNotEvent) {
      this.endpoints.forEach((item) => {
        !item._isInitedDom && item.destroy();
      });
      $(this.dom).remove();
      this.removeAllListeners();
      this._hasEventListener = false;
    } else {
      this.endpoints.forEach((item) => {
        !item._isInitedDom && item.destroy(isNotEvent);
      });
      $(this.dom).detach();
    }
    this._isInited = false;
  }
}

export default BaseLayers;
