'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');
require('./node.less');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }
  draw = (opts) => {
    let container = $('<div class="circle-node"></div>')
                    .attr('id', opts.id)
                    .css('top', opts.top + 'px')
                    .css('left', opts.left + 'px')

    let _angle = opts.options.posInfo.angle - 90;
    let _translateX = opts.options.posInfo._textLeft - opts.left;
    let _translateY = opts.options.posInfo._textTop - opts.top;

    let textDom = $(`<div class="circle-node-text">${opts.options.text}</div>`)
                  .css({
                    "transform": `translate(${_translateX}px, ${_translateY}px) rotate(${_angle}deg)`,						
                    "webkitTransform": `translate(${_translateX}px, ${_translateY}px) rotate(${_angle}deg)`,
                    "mozTransform": `translate(${_translateX}px, ${_translateY}px) rotate(${_angle}deg)`,
                    "msTransform": `translate(${_translateX}px, ${_translateY}px) rotate(${_angle}deg)`
                  });

    container.append(textDom);
    container.on('click', (event) => {
      this.emit('clickCircleNode', event.currentTarget)
    })
    return container[0];
  }
 
  // _createTypeIcon(dom = this.dom) {
  //   const iconContainer = $(`<span class="icon-box ${this.options.className}"></span>`)[0];
  //   const icon = $(`<i class="iconfont ${this.options.iconType}"></i>`)[0];

  //   iconContainer.append(icon);
  //   $(dom).append(iconContainer);
  // }

  // _createText(dom = this.dom) {
  //   $('<span class="text-box"></span>').text(this.options.label).appendTo(dom);
  // }
}

module.exports = BaseNode;
