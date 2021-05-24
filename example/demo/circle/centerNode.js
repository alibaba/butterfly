import $ from 'jquery';
import {Node} from 'butterfly-dag';

import './node.less';
class CenterNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }

  draw = (opts) => {
    let container = $('<div class="decision-node"></div>')
      .attr('id', opts.id)
      .css('top', opts.top + 'px')
      .css('left', opts.left + 'px');

    this._createLeft(container);
    this._createText(container);
    this._createRight(container);
    return container[0];
  }

  _createText(dom = this.dom) {
    $('<span class="text-box"></span>').text(this.options.text).appendTo(dom);
  }

  _createLeft(dom = this.dom) {
    let arrowLeft = $('<span class="arrow-left"></span>').appendTo(dom);
    arrowLeft.on('click', (event) => {
      this.emit('clickArrowLeft', event.currentTarget);
    });
    return arrowLeft;
  }

  _createRight(dom = this.dom) {
    let arrowRight = $('<span class="arrow-right"></span>').appendTo(dom);
    arrowRight.on('click', (event) => {
      this.emit('clickArrowRight', event.currentTarget);
    });
    return arrowRight;
  }
}

export default CenterNode;
