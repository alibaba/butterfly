'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');
require('./node.less');

class CenterNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw = (opts) => {
    let container = $('<div class="decision-node"></div>')
                    .attr('id', opts.id)
                    .css('top', opts.top + 'px')
                    .css('left', opts.left + 'px')

    this._createText(container);

    return container[0];
  }

  _createText(dom = this.dom) {
    $('<span class="text-box"></span>').text(this.options.text).appendTo(dom);
  }
}

module.exports = CenterNode;
