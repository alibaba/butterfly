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
    let container = $('<div class="force-node"></div>')
                    .css('top', opts.top + 'px')
                    .css('left', opts.left+ 'px')
                    .attr('id', opts.id);

    container.text(opts.options.index);

    return container[0];
  }
}

module.exports = BaseNode;
