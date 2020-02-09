'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');
require('./node.less');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
    this.typeIcon = null;
  }
  draw = (opts) => {
    let className = this.options.type;

    let container = $('<div class="base-node"></div>')
                    .css('top', opts.top + 'px')
                    .css('left', opts.left+ 'px')
                    .addClass(className)
                    .attr('id', opts.id);

    this._createTypeIcon(container);
    this._createText(container);

    return container[0];
  }
  addNewSourceEndpoint() {
    this.addEndpoint({
      id: Math.random(),
      dom: this.typeIcon,
      type: 'source'
    });
  }
  addNewTargetEndpoint() {
    this.addEndpoint({
      id: Math.random(),
      dom: this.typeIcon,
      type: 'target'
    });
  }
  addSubDom(dom = this.dom) {
    $('<div class="endpoint-box endpoint-box-1">hahahahahaha1</div>').appendTo(dom);
    this.addEndpoint({
      id: Math.random(),
      orientation: [-1, 0],
      pos: [0, 0.5],
      root: '.endpoint-box-1',
      type: 'target'
    });

    $('<div class="endpoint-box endpoint-box-2">hahahahahaha2</div>').appendTo(dom);
    this.addEndpoint({
      id: Math.random(),
      orientation: [1, 0],
      pos: [1, 0.5],
      root: '.endpoint-box-2',
      type: 'source'
    });
  }
  _createTypeIcon(dom = this.dom) {
    this.typeIcon = $('<span class="icon-box"></span>')[0];
    $(dom).append(this.typeIcon);
  }

  _createText(dom = this.dom) {
    $('<span class="text-box"></span>').text(this.options.name).appendTo(dom);
  }
}

module.exports = BaseNode;
