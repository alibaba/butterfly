'use strict';

const Edge = require('../../../index.js').Edge;
const $ = require('jquery');

class BaseEdge extends Edge {
  draw(obj) {
    let path = super.draw(obj);
    if (this.options.color) {
      $(path).addClass(this.options.color);
    }
    return path;
  }
  drawArrow(isShow) {
    let dom = super.drawArrow(isShow);
    if (this.options.color) {
      $(dom).addClass(this.options.color);
    }
    return dom;
  }
  drawLabel(text) {
    let dom = null;
    if (!!text) {
      dom = $(`<i class="iconfont icon-jiandao label ${text}"></i>`)[0];
    }
    return dom;
  }
};
module.exports = BaseEdge;