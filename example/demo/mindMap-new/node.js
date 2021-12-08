'use strict';

const Node = require('../../../index.js').TreeNode;
const $ = require('jquery');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
  }

  draw = (opts) => {
    console.log('opts: ', opts);
    let container = $('<div class="mind-map-node"></div>')
      .css('top', opts.top)
      .css('left', opts.left)
      .attr('id', opts.id);
    let titleDom = $(`
    <div class="title">
      <i class="iconfont">${opts.id === 'Root' ? '&#xe8b3;' : '&#xe6ff;'}</i>
      ${opts.options.title}
    <div>`);

    container.append(titleDom);

    return container[0];
  }
}

module.exports = BaseNode;