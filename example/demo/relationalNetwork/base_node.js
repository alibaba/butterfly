import {Node} from 'butterfly-dag';
import $ from 'jquery';
import './base_node.less';

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw = (opts) => {
    let container = $('<div class="relation-node"></div>')
      .css('top', opts.top)
      .css('left', opts.left)
      .attr('id', opts.id)
      .css('background-color', opts.options.color);

    let logoContainer = $('<div class="logo-container"></div>');
    logoContainer.css('background-color', opts.options.color);
    let logo = this.genLogo();
    // logo.css('color', '#F00');
    logoContainer.append(logo);

    let content = $('<p class="long-text"></p>').text(opts.options.name);

    container.append(logoContainer).append(content);

    return container[0];
  }
  genLogo = () => {
    console.log('请重载此方法');
  }
}

export default BaseNode;
