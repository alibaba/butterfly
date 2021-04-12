'use strict';

// const Edge = require('../../../index.js').Edge;
import { Edge } from 'butterfly-dag';
// import { Edge } from '../../../index';
const $ = require('jquery');

class BaseEdge extends Edge {
  draw(obj) {
    let path = super.draw(obj);
    if (this.options.lineType) {
      $(path).addClass(this.options.lineType);
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
};
module.exports = BaseEdge;