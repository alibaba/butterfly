'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');
require('./center.less');

class CenterNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw = (opts) => {
    let container = $('<div class="center-new-node"></div>')
                    .attr('id', opts.id)
                    .css('top', opts.top + 'px')
                    .css('left', opts.left + 'px')

    this._createTypeIcon(container);

    return container[0];
  }
  _createTypeIcon(dom = this.dom) {
    const textContainer = $(`<span class="name-box simple-blue">${this.options.name}</span>`)[0];
    $(dom).append(textContainer);
  }
}

module.exports = CenterNode;
