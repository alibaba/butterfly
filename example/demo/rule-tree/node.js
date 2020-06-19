'use strict';

const Node = require('../../../index.js').TreeNode;
const $ = require('jquery');
require('./node.less');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.addIcon = null;
    this.expandBtn = null;
  }
  draw = (opts) => {
    let container = $('<div class="rule-node"></div>')
                    .css('top', opts.top + 'px')
                    .css('left', opts.left+ 'px')
                    .attr('id', opts.id);
    
    let contentDom = $(`<span class="text ${opts.options.color}">${opts.options.text}</span>`);
    this.addIcon = $(`<i class="iconfont" title="添加节点">&#xe6a1;</i>`);
    this.expandBtn = $(`<i class="iconfont" title="展开">&#xe786;</i>`);

    container.append(contentDom);
    container.append(this.addIcon);
    container.append(this.expandBtn);

    this._attachEvent();

    return container[0];
  }
  _attachEvent() {
    $(this.expandBtn).on('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.collapsed) {
        // 可以在这里向后端请求数据,把node穿进去expand里面
        this.expand();
      } else {
        this.collapse();
      }
    });

    $(this.addIcon).on('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.emit('events', {
        type: 'custom:addSubNode',
        data: {
          parent: this.id
        }
      });
    });
  }
}

module.exports = BaseNode;
