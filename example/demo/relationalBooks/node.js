'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw = (opts) => {
    let className = this.options.type;
    let container = $('<div class="base-node"></div>')
      .css('top', opts.top + 'px')
      .css('left', opts.left + 'px')
      .addClass(className)
      .attr('id', opts.id);

    this._createTitle(container);
    this._createChildNode(container);

    return container[0];
  }

  _createTitle(dom) {
    let title = $(`
    <div class='title'>
      <span class="remove"><i class="iconfont">&#xe63a;</i></span>
      <span>${this.options.name}</span>
      <span class="add-node"><i class="iconfont">&#xe639;</i></span>
    </div>`);

    dom.append(title);
    this._onAddNode(title);
    this._onRemovedNode(title);
  }
  
  _createChildNode(dom) {
    $.each(this.options.data.content, (i, item) => {
      dom.append(`
      <div class="content">
        <span class="remove"><i class="iconfont">&#xe63a;</i></span>
        <span class="text">${item}</span>
        <span class="edit"><i class="iconfont">&#xe683;</i></span>
      </div>`);
    });

    let childNode = dom.find('.content');

    this._onRemovedNode(childNode);
    this._onEditNode(childNode);
  }

  _onRemovedNode(dom) {
    dom.find('.remove').on('click', function () {
      this.parentNode.remove();
    })
  }

  _onEditNode(dom) {
    dom.find('.edit').click(function () {
      const oldNode = $(this).prev('.text');

      if ($(oldNode.html()).attr("type") !== 'text') {
        oldNode.html(`<input type=text name=editname class=input-text value=${oldNode.html()} />`);
        oldNode.children().keyup(function (event) {
          if (event.keyCode === 13 || event.keyCode === 27) {
            const oldInputText = $(this).val();

            oldNode.text(oldInputText);
          }
        });
      }
    })
  }

  _onAddNode(dom) {
    dom.find('.add-node').click(function() {
    let code = '';
    const codeLength = 4;
    const random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');

    for (let i = 0; i < codeLength; i++) {
      const index = Math.floor(Math.random() * 36);
      code += random[index];
    }

    dom.parent('.base-node').append(`
      <div class="content">
        <span class=remove><i class="iconfont">&#xe63a;</i></span>
        <span>${code}</span>
        <span class="edit"><i class="iconfont">&#xe683;</i></span>
      </div>`);
    });
  }
}
module.exports = BaseNode;
