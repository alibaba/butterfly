'use strict';

const Edge = require('../../../index.js').Edge;
const $ = require('jquery');

class BaseEdge extends Edge {
  draw(obj) {
    let path = super.draw(obj);
    $(path).addClass('base-link');
    return path;
  }
  // 随时定制label的位置和样式
  redrawLabel() {
    if (this._labelDom0) {
      let beginPoint = this.dom.getPointAtLength(0);
      $(this._labelDom0)
        .css('left', beginPoint.x - this._labelDom0.offsetWidth / 2 + 20)
        .css('top', beginPoint.y - this._labelDom0.offsetHeight / 2 + 20);
    }
    if (this._labelDom1) {
      let pathLength = this.dom.getTotalLength();
      let endPoint = this.dom.getPointAtLength(pathLength);
      $(this._labelDom1)
        .css('left', endPoint.x - this._labelDom1.offsetWidth / 2 - 20)
        .css('top', endPoint.y - this._labelDom1.offsetHeight / 2 + 20);
    }
  }
  drawLabel(texts) {
    let dom = null;
    if (!!texts) {
      dom = document.createDocumentFragment();
      let inText = texts[0];
      let outText = texts[1];
      if (inText) {
        let dom0 = $(`<span class="in-label label">${inText}</span>`)[0];
        dom.append(dom0);
        this._labelDom0 = dom0;
      }
      if (outText) {
        let dom1 = $(`<span class="out-label label">${outText}</span>`)[0];
        dom.append(dom1);
        this._labelDom1 = dom1;
      }
    }
    return dom;
  }
};
module.exports = BaseEdge;