import {Node} from 'butterfly-dag';
import $ from 'jquery';
import './node.less';

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw = (opts) => {
    const container = $('<div class="login-base-node"></div>')
      .attr('id', opts.id)
      .css('top', opts.top + 'px')
      .css('left', opts.left + 'px')
      .addClass(opts.options.className);

    if (opts.options.circleType === 'border') {
      let textContainer;

      if (opts.options.label2) {
        textContainer = $(`<div class="text-box2 line-height"></div>`)[0];
        const span1 = $(`<span>${opts.options.label}</span>`)[0];
        const span2 = $(`<span>${opts.options.label2}</span>`)[0];

        textContainer.append(span1);
        textContainer.append(span2);
      } else {
        textContainer = $(`<div class="text-box2">${opts.options.label}</div>`)[0];
      }

      container.append(textContainer);

      return container[0];
    }

    this._createTypeIcon(container);
    this._createText(container);

    return container[0];
  }
  _createTypeIcon(dom = this.dom) {
    const iconContainer = $(`<div class="icon-box"></div>`)[0];
    const icon = $(`<i class="iconfont ${this.options.iconType}"></i>`)[0];

    iconContainer.append(icon);
    $(dom).append(iconContainer);
  }

  _createText(dom = this.dom) {
    $('<span class="text-box"></span>').text(this.options.label).appendTo(dom);
  }
}

export default BaseNode;
