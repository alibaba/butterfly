'use strict';

const Edge = require('../../../index.js').Edge;
const $ = require('jquery');

class BaseEdge extends Edge {
  draw(obj) {
    console.log(obj)
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