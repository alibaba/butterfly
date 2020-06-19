'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');
import './node.less';

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw = (opts) => {
    const container = $('<div class="flow-base-node"></div>')
                    .css('top', opts.top)
                    .css('left', opts.left)
                    .attr('id', opts.id);

    const logoContainer = $(`<div class="logo-containe"><i class="iconfont ${opts.options.iconType}"><i/></div>`);

    const content = $('<div class="text"></div>').text(opts.options.label);

    container.append(logoContainer).append(content);

    return container[0];
  }
}

module.exports = BaseNode;