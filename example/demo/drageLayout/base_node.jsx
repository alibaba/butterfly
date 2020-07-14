'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');
require('./base_node.less');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw = (opts) => {
    let container = $('<div class="relation-node"></div>')
      .css('top', opts.top)
      .css('left', opts.left)
      .attr('id', opts.id)
      .css('background-color', opts.options.color);

    let logoContainer = $(`<div class="logo-container">${opts.options.name}</div>`);
    logoContainer.css('background-color', opts.options.color);

    container.append(logoContainer);

    return container[0];
  }
}

module.exports = BaseNode;
