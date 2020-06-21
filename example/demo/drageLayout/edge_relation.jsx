'use strict';

let Edge = require('../../../index.js').Edge;
let $ = require('jquery');

class RelationEdge extends Edge {
  draw(obj) {
    let path = super.draw(obj);
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
    if (!!text) {
      dom = $(`<span class="butterflies-label">${text}</span>`)[0];
    }
    return dom;
  }
};
module.exports = RelationEdge;
