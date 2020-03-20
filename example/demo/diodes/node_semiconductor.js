'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');

class Semiconductor extends Node {
  constructor(opts) {
    super(opts);
    // 自定义变量
    this.endpointDom = null;

    this.images = {
      'semiconductor_1': 'https://img.alicdn.com/tfs/TB1EQHifrr1gK0jSZFDXXb9yVXa-280-150.png',
      'semiconductor_2': 'https://img.alicdn.com/tfs/TB1ESbgfpT7gK0jSZFpXXaTkpXa-313-150.png',
      'semiconductor_3': 'https://img.alicdn.com/tfs/TB1izDhfEY1gK0jSZFMXXaWcVXa-273-150.png',
      'semiconductor_4': 'https://img.alicdn.com/tfs/TB1I3befqL7gK0jSZFBXXXZZpXa-309-150.png',
      'semiconductor_5': 'https://img.alicdn.com/tfs/TB1hr_hfq67gK0jSZFHXXa9jVXa-311-150.png',
      'semiconductor_6': 'https://img.alicdn.com/tfs/TB1KinlfpP7gK0jSZFjXXc5aXXa-304-150.png',
      'semiconductor_7': 'https://img.alicdn.com/tfs/TB1CXPkfAL0gK0jSZFtXXXQCXXa-306-150.png',
      'semiconductor_8': 'https://img.alicdn.com/tfs/TB1ek6ofuH2gK0jSZJnXXaT1FXa-313-150.png'
    };
  }
  mounted() {
    // 设置右侧锚点
    this.addEndpoint({
      id: '0',
      type: 'source',
      dom: this.outputPointDom,
      orientation: [1, 0]
    });
    // 设置左侧锚点
    this.inputPointDoms.forEach((point, index) => {
      this.addEndpoint({
        id: (index + 1).toString(),
        type: 'target',
        dom: point,
        orientation: [-1, 0]
      });
    });
  }
  draw = (data) => {
    let container = $('<div class="base-node"></div>')
      .css('top', data.top)
      .css('left', data.left)
      .attr('id', data.id);

    if (this.options.type) {
      container.append(`<img src="${this.images[this.options.type]}">`);
    }

    this.outputPointDom = $('<div class="point output-point-0"></div>');
    container.append(this.outputPointDom);

    this.inputPointDoms = [];
    switch (this.options.type) {
      case 'semiconductor_1':
      case 'semiconductor_3':
        this.inputPointDoms.push($('<div class="point input-point-0"></div>'));
        break;
      case 'semiconductor_2':
      case 'semiconductor_4':
      case 'semiconductor_5':
      case 'semiconductor_6':
      case 'semiconductor_7':
      case 'semiconductor_8':
          this.inputPointDoms.push($('<div class="point input-point-1"></div>'));
          this.inputPointDoms.push($('<div class="point input-point-2"></div>'));
        break;
    }
    this.inputPointDoms.forEach((_inputEndpoint) => {
      container.append(_inputEndpoint);
    });

    return container[0]
  }
}

module.exports = Semiconductor;
