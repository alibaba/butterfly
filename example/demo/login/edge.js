import {Edge} from 'butterfly-dag';
import $ from 'jquery';

class BaseEdge extends Edge {
  draw(obj) {
    let path = super.draw(obj);

    if (this.options.lineType) {
      $(path).addClass(this.options.lineType);
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
    if (text) {
      dom = $(`<span class="account">${text}</span>`)[0];
    }
    return dom;
  }
}

export default BaseEdge;
