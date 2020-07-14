'use strict';

const Edge = require('../../../index.js').Edge;
const $ = require('jquery');

class BaseEdge extends Edge {
  draw(obj){
    let path = super.draw(obj);
    $(path).addClass('test-base-link');
    return path;
  }
  drawLabel(texts) {
  }
}
module.exports = BaseEdge;