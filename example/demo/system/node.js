'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
  }
  mounted() {

  }
  draw = (data) => {
    let container = $('<div class="base-node"></div>')
      .css('top', data.top)
      .css('left', data.left)
      .css('width', data.options.width)
      .css('height', data.options.height)
      .attr('id', data.id);

    //添加外框
    if (data.options.border) {
      container.addClass(data.options.border);
    }
    // 添加文字
    container.append(`<span class="text">${data.options.text}</span>`)

    return container[0];
  }
}

module.exports = BaseNode;
