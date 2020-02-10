'use strict';

const $ = require('jquery');

let svg = null;

let init = (_svg) => {
  svg = _svg;
}

let addAnimate = (targetDom, path, options, animateDom) => {
  let _animateDom = animateDom;
  if (_animateDom) {
    $(_animateDom).find('animateMotion').attr('path', path);
  } else {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', 0);
    circle.setAttribute('cy', 0);
    circle.setAttribute('r', options.r || 2);
    circle.setAttribute('fill', options.color || '#999');
    let motion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    motion.setAttribute('path', path);
    motion.setAttribute('begin', '0s');
    motion.setAttribute('dur', '8s');
    motion.setAttribute('repeatCount', 'indefinite');
    circle.append(motion);
    _animateDom = circle;
  }

  $(_animateDom).insertAfter(targetDom);

  return _animateDom;
}

export default {
  init,
  addAnimate
}