'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');

class AlisBaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }

  draw = (opts) => {
    let className = this.options.type;
    let container = $('<div class="group-node"></div>')
      .css('top', opts.top + 'px')
      .css('left', opts.left + 'px')
      .addClass(className)
      .attr('id', opts.id);

    this._createTitle(container);
    this._createContent(container);
    this._onRemoveNode(container);

    return container[0];
  }

  _createTitle = (dom) => {
    let title = $(
      `<div class="title">
        <span id="close"><i class="iconfont">&#xe63a;</i></span>
        <span class="title-text">${this.options.name}</span>
        <span class="alis-node-edit"><i class="iconfont">&#xe683;</i></span>
      </div>`);

    dom.append(title);
    this._editNode(title);
  }

  _createContent(dom) {
    let con = $(`
      <div class="container" >
        <p class="title-text">${this.options.data.content}</p>
        <span class="alis-node-edit"><i class="iconfont">&#xe683;</i></span>
      </div>`);

    dom.append(con);
    this._editNode(con);
  }

  _onRemoveNode(dom) {
    $(dom).find('#close').click(function () {
      dom[0].remove();
    });
  }

  _editNode = (dom) => {
    dom.find('.alis-node-edit').click(function (e) {
      const oldNode = $(this).prev('.title-text');

      if (dom[0] === $('.group-node > .title')[0]) {
        oldNode.html(`<input type=text name=editname class=input-text value='${oldNode.text()}' />`);
      } else {
        oldNode.html(`<textarea>${oldNode.text()}</textarea>`);
      }
      oldNode.children().keyup(function (event) {
        if (event.keyCode === 13 || event.keyCode === 27) {
          const oldInputText = $(this).val();

          $(this).parent('.title-text').text(oldInputText);
        }
      });
    })
  }
}
module.exports = AlisBaseNode;