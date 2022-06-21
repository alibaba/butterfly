'use strict';

import BaseEdge from '../../../../../src/edge/baseEdge';
import $ from 'jquery';
import { curveBasis, line } from 'd3-shape';

const matchFloats = /\d+\.\d+/g;

class KedrovizEdge extends BaseEdge {
  constructor(opts) {
    super(opts);
    this.points = opts.options.points;
    this.lineShape = line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(curveBasis);
  }
  draw(obj) {
    let path = super.draw(obj);
    if (this.options.color) {
      $(path).addClass(this.options.color);
    }
    return path;
  }
  redraw(obj) {
    let path = super.redraw(obj);
    if (this.options.color) {
      $(path).addClass(this.options.color);
    }
    return path;
  }
  drawArrow(isShow) {
    let dom = super.drawArrow(isShow);
    if (this.options.color) {
      $(dom).addClass(this.options.color);
    }
    return dom;
  }
  drawLabel(text) {
    let dom = null;
    if (text) {
      dom = $(`<i class="newIconfont iconjiandao-tianchong label ${text}"></i>`)[0];
    }
    return dom;
  }
  redrawPath(points) {
    let path = points && this.limitPrecision(this.lineShape(points));
    return path.replace(/,/g," ").replace(/([A-Z])/g,' $1 ').trim();;
  }
  toSinglePoint(value) {return parseFloat(value).toFixed(1);}
  limitPrecision(path){ return path.replace(matchFloats, this.toSinglePoint)};
  calcPath(sourcePoint, targetPoint) {
    return this.redrawPath(this.points);
  }
}

export default KedrovizEdge;
