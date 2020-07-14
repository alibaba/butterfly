'use strict';

const Group = require('../../../index.js').Group;
const $ = require('jquery');
const _ = require('lodash');

class BaseGroup extends Group {
  draw(obj) {
    let _dom = obj.dom;
    if (!_dom) {
      _dom = $('<div></div>')
        .attr('class', 'group')
        .css('top', obj.top)
        .css('left', obj.left)
        .attr('id', obj.id);
    }
    let group = $(_dom);

    this._container = $('<div></div>')
      .attr('class', 'container');
    
    group.append(this._container);

    // 添加文字
    if (_.get(obj, 'options.text')) {
      group.append(`<span class="text">${obj.options.text}</span>`);
    }

    return _dom;
  }
  // drawArrow(isShow) {
  //   let dom = super.drawArrow(isShow);
  //   if (this.options.color) {
  //     $(dom).addClass(this.options.color);
  //   }
  //   return dom;
  // }
  // drawLabel(text) {
  //   // let dom = super.drawArrow(text);
  //   // console.log(dom);
  //   let dom = null;
  //   if (!!text) {
  //     dom = $(`<span class="label">${text}</span>`)[0];
  //   }
  //   return dom;
  // }
};
module.exports = BaseGroup;