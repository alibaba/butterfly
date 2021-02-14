import {Node} from 'butterfly-dag';
import $ from 'jquery';

import './node.less';

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw = (opts) => {
    let container = $('<div class="note-target-node"></div>')
      .attr('id', opts.id)
      .css('top', opts.top + 'px')
      .css('left', opts.left + 'px');

    let textDom = $(`<span class="note-text ${opts.options.side}-side">${opts.options.text}</span>`);
    container.append(textDom);

    return container[0];
  }
}

export default BaseNode;
