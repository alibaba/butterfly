'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');
require('./node.less');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.id = opts.id;
    this.top = opts.x;
    this.left = opts.y;
    this.options = opts;
  }
  draw = (opts) => {
    let container = $('<div class="radial-node"></div>')
                    .css('top', this.top + 'px')
                    .css('left', this.left+ 'px')
                    .attr('id',  this.id = opts.id);
    container.text(opts.options.id);

    return container[0];
  }
}

module.exports = BaseNode;
