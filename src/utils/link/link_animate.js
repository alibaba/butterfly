'use strict';

const $ = require('jquery');

let svg = null;

let _initTime = new Date().getTime();

let init = (_svg) => {
  svg = _svg;
  _initTime = new Date().getTime();
}

let addAnimate = (targetDom, path, options = {}, animateDom) => {
  let _animateDom = animateDom;
  let circle = null;
  let motion = null;
  if (!_animateDom) {
    circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    motion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    circle.append(motion);
  }

  if (options._isContinue) {
    // $(_animateDom).find('animateMotion').attr('path', path);
    // 为了适配延迟加载的问题,需要重新replaceWith动画标签
    let tmpAnimateDom = _animateDom.cloneNode(true);
    $(tmpAnimateDom).find('animateMotion').attr('path', path);
    $(_animateDom).replaceWith(tmpAnimateDom);
    _animateDom = tmpAnimateDom;
  } else {
    let _startTime = (new Date().getTime() - _initTime) / 1000;

    if (_animateDom) {
      circle = _animateDom;
      motion = $(_animateDom).find('animateMotion')[0];
      $(circle).css('display', 'block');
    }

    circle.setAttribute('cx', 0);
    circle.setAttribute('cy', 0);
    circle.setAttribute('r', options.radius || 2);
    circle.setAttribute('fill', options.color || '#999');

    motion.setAttribute('path', path);
    motion.setAttribute('begin', `${_startTime}s`);
    motion.setAttribute('dur', options.dur || '8s');
    motion.setAttribute('fill', 'freeze');
    motion.setAttribute('repeatCount', options.repeatCount || 'indefinite');

    if (options.repeatCount && options.repeatCount !== 'indefinite') {
      setTimeout(() => {
        $(circle).css('display', 'none');
      }, parseFloat(options.dur) * parseInt(options.repeatCount) * 1000);
    }
  }

  if (!_animateDom) {
    _animateDom = circle;
    // 延迟插入
    setTimeout(() => {
      $(_animateDom).insertAfter(targetDom);
    }, 20);
  }

  return _animateDom;
}

export default {
  init,
  addAnimate
}