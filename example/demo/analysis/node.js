'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');
require('./node.less');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw = (opts) => {
    if (opts.options.type === 'circle') {
      const container = $('<div class="analysis-circle-base-node"></div>')
                      .attr('id', opts.id)
                      .css('top', opts.top + 'px')
                      .css('left', opts.left + 'px');
      const icon = $(`<i class="iconfont icon-shujuji"></i>`);

      container.append(icon);           
      
      return container[0];            
    }
    const container = $('<div class="analysis-base-node"></div>')
                    .attr('id', opts.id)
                    .css('top', opts.top + 'px')
                    .css('left', opts.left + 'px')

    // this._createTypeIcon(container);
    this._createText(container);

    return container[0];
  }
  _createTypeIcon(dom = this.dom) {
    const iconContainer = $(`<span class="icon-box ${this.options.className}"></span>`)[0];
    const icon = $(`<i class="iconfont ${this.options.iconType}"></i>`)[0];

    iconContainer.append(icon);
    $(dom).append(iconContainer);
  }

  _createText(dom = this.dom) {
    $('<span class="text-box"></span>').text(this.options.label).appendTo(dom);
  }
}

module.exports = BaseNode;
