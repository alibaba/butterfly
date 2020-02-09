'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');

class Input extends Node {
  constructor(opts) {
    super(opts);
    // 自定义变量
    this.endpointDom = null;
  }
  mounted() {
    this.addEndpoint({
      id: '0',
      type: this.options.type === 'input' ? 'source' : 'target',
      dom: this.endpointDom
    });
  }
  draw = (data) => {
    let container = $(`<div class="base-node info-node ${data.options.type}-node"></div>`)
      .css('top', data.top)
      .css('left', data.left)
      .attr('id', data.id);

    container.append($(`<span class="text">${_.get(data, 'options.type').toUpperCase()}</span>`));
    
    container.append($(`<div class="line ${data.options.type}-line"></div>`));

    this.endpointDom = $(`<div class="point ${data.options.type}-point"></div>`);

    container.append(this.endpointDom);
    
    return container[0]
  }
}

module.exports = Input;
