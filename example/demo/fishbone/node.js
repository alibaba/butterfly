'use strict';

// const Node = require('../../../index.js').Node;
import { Node } from 'butterfly-dag';
const $ = require('jquery');
require('./node.less');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw = (opts) => {
    const container = $('<div class="analysis-base-node"></div>')
                    .attr('id', opts.id)
                    .css('top', opts.top + 'px')
                    .css('left', (opts.left + 40) + 'px');
    $('<span class="tmpText"></span>').text(this.options.label).appendTo(container);

    // this._createTypeIcon(container);
    // this._createText(container);

    return container[0];
  }

  // _createText(dom = this.dom) {
  //   $('<span class="text-box"></span>').text(this.options.label).appendTo(dom);
  // }
}

module.exports = BaseNode;
