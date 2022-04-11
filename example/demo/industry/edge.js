'use strict';

//import { Edge } from 'butterfly-dag';
import Edge from '../../../src/edge/baseEdge';
import $ from 'jquery';
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
    // let dom = super.drawArrow(text);
    // console.log(dom);
    let dom = null;
    if (!!text) {
      dom = $(`<span class="label">${text}</span>`)[0];
    }
    return dom;
  }
};

export default BaseEdge;