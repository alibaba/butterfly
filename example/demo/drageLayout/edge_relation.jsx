'use strict';

let Edge = require('../../../index.js').Edge;
let $ = require('jquery');

class RelationEdge extends Edge {
  draw = (obj) => {
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('class', 'butterflies-link');
    path.addEventListener('mouseover', () => {
      $(this.labelDom).addClass('xxxx')
    });
    return path;
  }
  redraw = (sourcePoint, targetPoint, options) => {
    // 重新计算线条path
    let path = this._calcPath();
    this.dom.setAttribute('d', path);
    if (this.labelDom) {
      this.redrawLabel();
    }
  }
  drawLabel() {
    return $('<span class="butterflies-label">乘火车</span>')[0];
  }
};
module.exports = RelationEdge;
