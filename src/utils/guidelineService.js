'use strict';

const $ = require('jquery');
const _ = require('lodash');

class GuidelineService {
  constructor(opts) {
    this.root = opts.root;
    this.canvas = opts.canvas;
    this.dom = null;
    this.cxt = null;

    this.isActive = false;

    this.limitNum = opts.limitNum;
    this.adsorp = _.assign({
      enable: false,
      gap: 5
    }, opts.adsorp || {});
    this.theme = {
      lineColor: '#9fd1ff',
      lineWidth: 1
    };

    this._adsorpTimer = null;
  }
  _resize() {
    this.canvasHeight = $(this.root).height();
    this.canvasWidth = $(this.root).width();
    $(this.guideLineCanvas).attr('width', this.canvasWidth);
    $(this.guideLineCanvas).attr('height', this.canvasHeight);
  }
  create(options = {}) {
    this.theme = _.merge(this.theme, options.theme || {});
    this.adsorp = _.merge(this.adsorp, options.adsorp || {});
    if (!this.dom) {
      this.dom = $('<div class="butterfly-guide-canvas-wrapper"></div>')[0];
      this.guideLineCanvas = $('<canvas class="butterfly-guideline-canvas"></canvas>')[0];
      this._resize();
      $(this.guideLineCanvas).appendTo(this.dom);
      $(this.dom).appendTo(this.root);
    }

    this.cxt = this.guideLineCanvas.getContext('2d');
    this.cxt.strokeStyle = this.theme.lineColor || '#000';
    this.cxt.lineWidth = this.theme.lineWidth || 1;
    this.isActive = true;
  }
  guidLine(
    moveTo = [0, 0],
    lineTo = [0, 0]
  ) {
    const process = (coord) => {
      return Math.floor(coord) + 0.5;
    };
    this.cxt.beginPath();
    this.cxt.moveTo(process(moveTo[0]), process(moveTo[1]));
    this.cxt.lineTo(process(lineTo[0]), process(lineTo[1]));
    this.cxt.stroke();
    this.cxt.closePath();
  } 
  draw(item, type) {

    this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    let _left = parseInt(item.left);
    let _right = parseInt(item.left + item.getWidth(true));
    let _top = parseInt(item.top);
    let _bottom = parseInt(item.top + item.getHeight(true));
    let _leftDis = Infinity;
    let _rightDis = Infinity;
    let _topDis = Infinity;
    let _bottomDis = Infinity;
    let _gap = this.adsorp.enable ? this.adsorp.gap : 0;

    let _leftObj = null;
    let _rightObj = null;
    let _topObj = null;
    let _bottomObj = null;

    let groups = this.canvas.groups;
    let nodes = this.canvas.nodes;
    groups.forEach((_group) => {
      if (type === 'group' && item.id === _group.id) {
        return;
      }

      let _groupLeft = parseInt(_group.left);
      let _groupRight = parseInt(_group.left + _group.getWidth());
      let _groupTop = parseInt(_group.top);
      let _groupBottom = parseInt(_group.top + _group.getHeight());

      // 向左对齐的元素
      if (Math.abs(_left - _groupLeft) <= _gap) {
        if (Math.abs(_groupTop - _top) < _topDis) {
          _topDis = Math.abs(_groupTop - _top);
          _leftObj = {
            item: _group,
            gap: _left - _groupLeft
          };
        }
      }

      // 向右对齐的元素
      if (Math.abs(_right - _groupRight) <= _gap) {
        if (Math.abs(_groupBottom - _bottom) < _bottomDis) {
          _bottomDis = Math.abs(_groupBottom - _bottom);
          _rightObj = {
            item: _group,
            gap: _right - _groupRight
          };
        }
      }

      // 向上对齐的元素
      if (Math.abs(_top - _groupTop) <= _gap) {
        if (Math.abs(_groupLeft - _left) < _leftDis) {
          _leftDis = Math.abs(_groupLeft - _left);
          _topObj = {
            item: _group,
            gap: _top - _groupTop
          };
        }
      }

      // 向下对齐的元素
      if (Math.abs(_bottom - _groupBottom) <= _gap) {
        if (Math.abs(_groupRight - _right) < _rightDis) {
          _rightDis = Math.abs(_groupRight - _right);
          _bottomObj = {
            item: _group,
            gap: _groupRight - _right
          };
        }
      }
    });
    
    nodes.forEach((_node) => {
      if (type === 'node' && item.id === _node.id) {
        return;
      }

      let _nodeLeft = parseInt(_node.left);
      let _nodeRight = parseInt(_node.left + _node.getWidth());
      let _nodeTop = parseInt(_node.top);
      let _nodeBottom = parseInt(_node.top + _node.getHeight());

      if (_node._group) {
        _nodeLeft += _node._group.left;
        _nodeRight += _node._group.left;
        _nodeTop += _node._group.top;
        _nodeBottom += _node._group.top;
      }

      // 向左对齐的元素
      if (Math.abs(_left - _nodeLeft) <= _gap) {
        if (Math.abs(_nodeTop - _top) < _topDis) {
          _topDis = Math.abs(_nodeTop - _top);
          _leftObj = {
            item: _node,
            gap: _left - _nodeLeft
          };
        }
      }

      // 向右对齐的元素
      if (Math.abs(_right - _nodeRight) <= _gap) {
        if (Math.abs(_nodeBottom - _bottom) < _bottomDis) {
          _bottomDis = Math.abs(_nodeBottom - _bottom);
          _rightObj = {
            item: _node,
            gap: _right - _nodeRight
          };
        }
      }

      // 向上对齐的元素
      if (Math.abs(_top - _nodeTop) <= _gap) {
        if (Math.abs(_nodeLeft - _left) < _leftDis) {
          _leftDis = Math.abs(_nodeLeft - _left);
          _topObj = {
            item: _node,
            gap: _top - _nodeTop
          };
        }
      }

      // 向下对齐的元素
      if (Math.abs(_bottom - _nodeBottom) <= _gap) {
        if (Math.abs(_nodeRight - _right) < _rightDis) {
          _rightDis = Math.abs(_nodeRight - _right);
          _bottomObj = {
            item: _node,
            gap: _bottom - _nodeBottom
          };
        }
      }
    });

    let _autoAdsorp = (target, left, top) => {
      if (!this._adsorpTimer) {
        target.moveTo(left, top, false);
        this._adsorpTimer = setTimeout(() => {
          clearTimeout(this._adsorpTimer);
          this._adsorpTimer = null;
        }, 100);
      }
    }

    if (_leftObj) {
      let _leftItem = _leftObj.item;
      let startY = _top > _leftItem.top ? _leftItem.top : _top;
      let endY = _top > _leftItem.top ? _bottom : _leftItem.top + _leftItem.getHeight();
      let left = _leftItem.left;
      _autoAdsorp(item, item.left - _leftObj.gap, item.top);
      this.guidLine([left, startY], [left, endY]);
    }

    if (_rightObj) {
      let _rightItem = _rightObj.item;
      let startY = _top > _rightItem.top ? _rightItem.top : _top;
      let endY = _top > _rightItem.top ? _bottom : _rightItem.top + _rightItem.getWidth();
      let right = parseInt(_rightItem.left + _rightItem.getWidth(true));
      _autoAdsorp(item, item.left - _rightObj.gap, item.top);
      this.guidLine([right, startY], [right, endY]);
    }

    if (_topObj) {
      let _topItem = _topObj.item;
      let startX = _left > _topItem.left ? _topItem.left : _left;
      let endX = _left > _topItem.left ? _right : _topItem.left + _topItem.getWidth();
      let top = _topItem.top;
      _autoAdsorp(item, item.left, item.top - _topObj.gap);
      this.guidLine([startX, top], [endX, top]);
    }

    if (_bottomObj) {
      let _bottomItem = _bottomObj.item;
      let startX = _left > _bottomItem.left ? _bottomItem.left : _left;
      let endX = _left > _bottomItem.left ? _right : _bottomItem.left + _bottomItem.getHeight();
      let bottom = parseInt(_bottomItem.top + _bottomItem.getHeight(true));
      _autoAdsorp(item, item.left, item.top - _bottomObj.gap);
      this.guidLine([startX, bottom], [endX, bottom]);
    }
    
  }
  zoom(scale) {
    $(this.dom).css({
      transform: `scale(${scale})`
    });
    this.clearCanvas();
  }
  move(x, y) {
    $(this.dom)
      .css('left', x)
      .css('top', y);
    this.clearCanvas();
  }
  setOrigin(x, y) {
    $(this.dom)
      .css('transform-origin', `${x}% ${y}%`)
  }
  clearCanvas() {
    this.cxt && this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
  destroy() {
    this.dom && $(this.dom).destroy();
    this.isActive = false;
  }
}

export default GuidelineService;
