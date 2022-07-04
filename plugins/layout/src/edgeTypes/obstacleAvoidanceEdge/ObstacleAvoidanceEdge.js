'use strict';

import {Edge} from 'butterfly-dag';
// import BaseEdge from '../../../../src/edge/baseEdge';
import $ from 'jquery';
import { curveBasis, line } from 'd3-shape';

const matchFloats = /\d+\.\d+/g;

/**
 * 避障贝塞尔曲线
 */
class KedrovizEdge extends Edge {
  constructor(opts) {
    super(opts);
    this.points = opts.options.points;
    this.lineShape = line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(curveBasis);
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
    return path.replace(/,/g," ").replace(/([A-Z])/g,' $1 ').trim();
  }
  toSinglePoint(value) {return parseFloat(value).toFixed(1);}
  limitPrecision(path){ return path.replace(matchFloats, this.toSinglePoint)};
  calcPath(sourcePoint, targetPoint) {
    this.emit('custom',{
      type: "edge:calcPath",
      data: this
    });
    return this.redrawPath(this.points);
  }
}

export default KedrovizEdge;
