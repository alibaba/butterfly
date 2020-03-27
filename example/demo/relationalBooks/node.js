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
    let className = this.options.type;
    let container = $('<div class="base-node"></div>')
      .css('top', opts.top + 'px')
      .css('left', opts.left + 'px')
      .addClass(className)
      .attr('id', opts.id);

    this._createTitle(container);
    this._createChildNode(container);
    this._addNode(container);
    this._editNode(container);
    
    return container[0];
  }

  _createTitle(dom = this.dom) {
    let title = $(`
    <div class='title'>
      <span class="remove"><i class="iconfont">&#xe63a;</i></span>
      <span>${this.options.name}</span>
      <span class="add-node"><i class="iconfont">&#xe639;</i></span>
    </div>`);
    
    dom.append(title);
  }
  
  _createChildNode(dom = this.dom) {
    $.each(this.options.data.content, (i, item) => {
      dom.append(`<div class="content"><span class=remove><i class="iconfont">&#xe63a;</i></span><span class="text">${item}</span><span class="edit"><i class="iconfont">&#xe683;</i></span></div>`);
    });
  }

  removeChildNode() {
    $(function () {
      $(`.content > .remove, .title > .remove`).each(function (index) {
        $(this).on('click', function () {
          this.parentNode.remove();
        });
      });
    });
  }

  _editNode(dom = this.dom) {
    $(dom).find('.edit').each(function() {
      $(this).on('click', function (e) {
        const oldNode = $(this).prev('.text').html();
        $(this).prev('.text').html(`<input type=text name=editname class=input-text value=${oldNode} />`);
        $(this).prev('.text').children().keyup(function (event) {
          if (event.keyCode === 13 || event.keyCode === 27) {
            const oldInputText = $(this).val();
            $(this).parent('.text').text(oldInputText);
          }
        });
      });
    })
  }

  _addNode(dom = this.dom) {
      $(dom).find('.add-node').each(function () {
        $(this).on('click', function(e) {
          let code = '';
          const codeLength = 4;
          const random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
          for (let i = 0; i < codeLength; i++) {
            const index = Math.floor(Math.random() * 36);
            code += random[index];
          }
          dom.append(`
            <div class="content">
              <span class=remove><i class="iconfont">&#xe63a;</i></span>
              <span>${code}</span>
              <span class="edit"><i class="iconfont">&#xe683;</i></span>
            </div>`);
        });
      })
  }
}
module.exports = BaseNode;
