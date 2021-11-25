import {Node} from 'butterfly-dag';
import $ from 'jquery';

import './node.less';

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw = (opts) => {
    let container = $('<div class="note-source-node"></div>')
      .attr('id', opts.id)
      .css('top', opts.top + 'px')
      .css('left', opts.left + 'px');

    return container[0];
  }
}

export default BaseNode;
