import $ from 'jquery';
import {Node} from 'butterfly-dag';

import './node.less';

let prevNode = null;
class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
  }

  draw = (opts) => {
    let container = $('<div class="circle-node"></div>')
      .attr('id', opts.id)
      .css('top', opts.top + 'px')
      .css('left', opts.left + 'px');

    let _angle = opts.options.posInfo.angle - 90;
    let _translateX = opts.options.posInfo._textLeft - opts.left;
    let _translateY = opts.options.posInfo._textTop - opts.top;

    let textDom = $(`<div class="circle-node-text">${opts.options.text}</div>`)
      .css({
        transform: `translate(${_translateX}px, ${_translateY}px) rotate(${_angle}deg)`,
        webkitTransform: `translate(${_translateX}px, ${_translateY}px) rotate(${_angle}deg)`,
        mozTransform: `translate(${_translateX}px, ${_translateY}px) rotate(${_angle}deg)`,
        msTransform: `translate(${_translateX}px, ${_translateY}px) rotate(${_angle}deg)`
      });

    container.append(textDom);

    container.on('click', (event) => {
      let id = event.currentTarget.id;
      $('.circle-node-text').removeClass('circle-node-text-border');
      if (prevNode !== id) {
        $(textDom).addClass('circle-node-text-border');
        prevNode = id;
      } else {
        prevNode = null;
      }

      this.emit('clickCircleNode', event.currentTarget);
    });

    return container[0];
  }

  active(nodeDom) {
    $(nodeDom).addClass('circle-node-bg');
    $(nodeDom).children('.circle-node-text').addClass('circle-node-text-color');
  }
}

export default BaseNode;
