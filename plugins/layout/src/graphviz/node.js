'use strict';

// const Node = require('../../../index.js').Node;
import {Node} from 'butterfly-dag';
import $ from 'jquery';

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw (opts) {
    const container = $('<div class="graphviz-base-node"></div>')
                    .attr('id', opts.id)
                    .css('top', opts.top + 'px')
                    .css('left', (opts.left) + 'px')
                    .css('width', opts.options.width)
                    .css('height', opts.options.height);
    $('<span class="tmpText"></span>').text(this.options.label).appendTo(container);

    // this._createTypeIcon(container);
    // this._createText(container);

    return container[0];
  }

  // _createText(dom = this.dom) {
  //   $('<span class="text-box"></span>').text(this.options.label).appendTo(dom);
  // }
}

export default BaseNode;
