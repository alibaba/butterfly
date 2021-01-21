'use strict';

// const Edge = require('../../../index.js').Edge;
import { Edge } from 'butterfly-dag';
const $ = require('jquery');

class BaseEdge extends Edge {
  draw(obj) {
    let path = super.draw(obj);
    if (this.options.color) {
      $(path).addClass(this.options.color);
    }
    return path;
  }
};
module.exports = BaseEdge;