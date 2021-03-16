'use strict';

import './toolTip.less';

const $ = require('jquery');

const DEFUALT = {
  TEMPLATE:
    '<div class="butterfly-tooltip-container"><div class="butterfly-tooltip-arrow"></div><div class="butterfly-tooltip-inner"></div></div>',
  $viewAppend: 'body',
  $viewCon: {
    tips: '.butterfly-tips',
    menu: '.butterfly-menu',
    common: '.butterfly-tooltip-container'
  },
  $inner: '.butterfly-tooltip-inner'
};

const _toFixed_3 = (num) => {
  if (!num) {
    return 0;
  }
  if (Number(num)) {
    return Number(parseFloat(num).toFixed(3));
  }
};

const _getTipOffset = (placement, pos, offset = {x: 0, y: 0}) => {
  const _pos = {};
  let { left, top, width, height, actualWidth, actualHeight } = pos;
  left = _toFixed_3(left);
  top = _toFixed_3(top);
  width = _toFixed_3(width);
  height = _toFixed_3(height);
  actualWidth = _toFixed_3(actualWidth);
  actualHeight = _toFixed_3(actualHeight);

  switch (placement) {
    case 'top':
      _pos.left = left + width / 2 - actualWidth / 2;
      _pos.top = top - actualHeight - 5;
      break;
    case 'left':
      _pos.left = left - actualWidth - 5;
      _pos.top = top + height / 2 - actualHeight / 2;
      break;
    case 'right':
      _pos.left = left + width + 5;
      _pos.top = top + height / 2 - actualHeight / 2;
      break;
    case 'bottom':
      _pos.left = left + width / 2 - actualWidth / 2;
      _pos.top = top + height + 5;
      break;
    default:
      _pos.left = left + width / 2 - actualWidth / 2;
      _pos.top = top - height - 5;
  }

  if (offset.x) {
    _pos.left += offset.x;
  }
  if (offset.y) {
    _pos.top += offset.y;
  }
  return _pos;
};

let _menuOldPos = {x: 0, y: 0}
const show = (opts, type, tipsDom, targetDom, callback) => {
  $(DEFUALT.$viewCon[type]).remove();

  let tipsContainer = $(DEFUALT.TEMPLATE);
  tipsContainer.find(DEFUALT.$inner).append(tipsDom);
  $(tipsContainer).appendTo(DEFUALT.$viewAppend);

  let placement = opts.placement || 'top';

  $(tipsContainer)
    .addClass(DEFUALT.$viewCon[type].replace('.', ''))
    .addClass(placement)
    .addClass('in'); // todo in的动画
  if (opts.className) {
    tipsContainer.addClass(opts.className);
  }

  const pos = {
    top: $(targetDom).offset().top,
    left: $(targetDom).offset().left,
    width: $(targetDom).outerWidth(),
    height: $(targetDom).outerHeight(),
    actualWidth: $(tipsContainer).outerWidth(),
    actualHeight: $(tipsContainer).outerHeight()
  };

  let posInit = {}
  if (opts.x || opts.x === 0) {
    posInit = {
      left: opts.offsetX ? opts.x + opts.offsetX : opts.x,
      top: opts.offsetY ? opts.y + opts.offsetY : opts.y
    }
  } else {
    let offset = {
      x: 0,
      y: 0
    };
    if (opts.offsetX) {
      offset.x = opts.offsetX;
    }
    if (opts.offsetY) {
      offset.y = opts.offsetY;
    }
    posInit = _getTipOffset(placement, pos, offset);
  }
  _menuOldPos = {
    x: posInit.left,
    y: posInit.top
  };
  const position = `top: ${posInit.top}px; left: ${posInit.left}px;`;
  $(tipsContainer).attr('style', position);
  callback && callback(tipsContainer[0]);
  return tipsContainer[0];
}

const hide = (tipsDom, callback) => {
  $(tipsDom).removeClass('in').remove();
  callback && callback(tipsDom);
};

let createTip = (opts, callback) => {
  let currentTips = null;
  let tipstDom = null;
  let isMouseInTips = false;
  let isMouseInTarget = false;
  let timer = null;
  let _mouseIn = (e) => {
    isMouseInTips = true;
  }
  let _mouseOut = (e) => {
    isMouseInTips = false;
    _hide();
  }
  let _hide = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      if (!isMouseInTips && !isMouseInTarget && currentTips) {
        hide(currentTips);
        currentTips.removeEventListener('mouseover', _mouseIn);
        currentTips.removeEventListener('mousemove', _mouseIn);
        currentTips.removeEventListener('mouseout', _mouseOut);
      }
    }, 50);
  }
  let {data, targetDom, genTipDom} = opts;
  let _tipsDom = opts.tipsDom;
  targetDom.addEventListener('mouseover', (e) => {
    isMouseInTarget = true;
    if (_tipsDom) {
      tipstDom = _tipsDom;
    }
    if (genTipDom) {
      tipstDom = genTipDom(data);
    }
    currentTips = show(opts, 'tips', tipstDom, targetDom, callback);
    currentTips.addEventListener('mouseover', _mouseIn);
    currentTips.addEventListener('mousemove', _mouseIn);
    currentTips.addEventListener('mouseout', _mouseOut);
  });

  targetDom.addEventListener('mouseout', (e) => {
    isMouseInTarget = false;
    _hide();
  });

};

let currentMenu = null;
let currentDragDom = null;
let _isDraggingMenu = false;
let _mouseOldPos = {x: 0, y: 0};
let _hideMenu = (e) => {
  if (e.target === currentMenu || $(currentMenu).find(e.target).length > 0) {
    return ;
  }
  currentMenu && hide(currentMenu);
  document.removeEventListener('click', _hideMenu);
}
let createMenu = (opts, callback) => {
  let {data, targetDom, genTipDom} = opts;
  let _createMenu = () => {
    let tipsDom = null;
    if (genTipDom) {
      tipsDom = genTipDom(data);
    }
    if (opts.tipsDom) {
      tipsDom = opts.tipsDom;
    }
    currentMenu = show(opts, 'menu', tipsDom, targetDom, callback);
    if (opts.closable) {
      document.addEventListener('click', _hideMenu);
    }

    if (opts.draggable) {
      if (!opts.dragDom) {
        currentDragDom = currentMenu;
      } else {
        currentDragDom = opts.dragDom;
      }
      document.addEventListener('mousedown', _dragBegin);
      document.addEventListener('mousemove', _dragMove);
      document.addEventListener('mouseup', _dragEnd);
    }
  }
  if (opts.action === 'click') {
    targetDom.addEventListener('click', _createMenu);
  } else {
    _createMenu();
  }
}

let closeMenu = (callback) => {
  hide(currentMenu, callback);
  currentMenu = null;
  document.removeEventListener('click', _hideMenu);
  if (currentDragDom) {
    document.removeEventListener('mousedown', _dragBegin);
    document.removeEventListener('mousemove', _dragMove);
    document.removeEventListener('mouseup', _dragEnd);
    currentDragDom = null;
  }
}

let _dragBegin = (e) => {
  _isDraggingMenu = true;
  _mouseOldPos = {
    x: e.clientX,
    y: e.clientY
  }
}
let _dragTimer = null;
let _dragMove = (e) => {
  if (_isDraggingMenu && currentDragDom) {
    if (_dragTimer) {
      return;
    }
    _dragTimer = setTimeout(() => {
      let _y = _menuOldPos.y + (e.clientY - _mouseOldPos.y);
      let _x = _menuOldPos.x + (e.clientX - _mouseOldPos.x);
      $(currentMenu)
        .css('top', _y)
        .css('left', _x);
        _mouseOldPos = {
          x: e.clientX,
          y: e.clientY
        }
        _menuOldPos = {
          x: _x,
          y: _y
        }
        _dragTimer = null;
    }, 20);
  }
}
let _dragEnd = (e) => {
  _isDraggingMenu = false;
}

export default {
  createTip,
  createMenu,
  closeMenu
};