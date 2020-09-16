'use strict';

const Node = require('../../../index.js').Node;
// const Node = require('../../../services/butterflies/src/node/baseNode');
const $ = require('jquery');
require('./node.less');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.id = opts.id;
    this.top = opts.top;
    this.left = opts.left;
    this.options = opts;
  }
  draw = (opts) => {
    let container = $('<div class="grid-node"></div>')
                    .css('top', this.top + 'px')
                    .css('left', this.left+ 'px')
                    .attr('id',  this.id = opts.id);

    container.text(opts.options.id);

    return container[0];
  }
}

module.exports = BaseNode;
