'use strict';

const $ = require('jquery');
const _ = require('lodash');

class GridService {
  constructor(opts) {
    this.root = opts.root;
    this.canvas = opts.canvas;

    this.domWrapper = _.get(opts, 'canvas.wrapper');
    this.canvasHeight = 0;
    this.canvasWidth = 0;

    this.dom = null;
    this.isActive = false;
    this.theme = _.get(opts, 'theme', {}) || {
      shapeType: 'circle',  // 展示的类型，支持line & circle
      gap: 5,            // 网格间隙
      adsorbGap: '5px',      // 吸附间距
      backgroud: '#fff',  // 网格背景颜色
      lineColor: '#000',  // 网格线条颜色
      lineWidth: '1px',   // 网格粗细
      circleRadiu: 2, // 圆点半径
      circleColor: '#000' // 断电颜色
    };
  }
  create(options = {}) {
    this.theme = _.merge(this.theme, options.theme || {});

    this.canvasHeight = $(this.root).height();
    this.canvasWidth = $(this.root).width();

    this.dom = $('<canvas class="butterfly-gird-canvas"></canvas>')[0];
    $(this.dom).attr('width', this.canvasWidth);
    $(this.dom).attr('height', this.canvasHeight);

    $(this.dom).appendTo(this.root);

    if (this.theme.shapeType === 'circle') {
      this.createCircle();
    } else if (this.theme.shapeType === 'line') {
      this.createLine();
    }
    this.isActive = true;
  }
  createCircle() {
    let _ctx = this.dom.getContext('2d');
    _ctx.fillStyle = this.theme.circleColor || '#000';
    let _p = Math.PI * 2;
    let _gap = parseInt(this.theme.gap);
    _gap = _gap < 5 ? 5 : _gap;
    for (let i = 0; i < this.canvasWidth; i += _gap) {
      for (let j = 0; j < this.canvasHeight; j += _gap) {
        _ctx.moveTo(i, j);
        _ctx.arc(i, j, this.theme.circleRadiu, 0, _p);
      }
    }
    _ctx.fill();
  }
  createLine() {
    let _ctx = this.dom.getContext('2d');
    _ctx.strokeStyle = this.theme.lineColor || '#000';
    _ctx.lineWidth = this.theme.lineWidth || 1;
    let _gap = parseInt(this.theme.gap);
    _gap = _gap < 5 ? 5 : _gap;
    for (let j = 0; j < this.canvasHeight; j += _gap) {
      _ctx.beginPath();
      _ctx.moveTo(0, j);
      _ctx.lineTo(this.canvasWidth, j);
      _ctx.stroke();
      _ctx.closePath();
    }
    for (let i = 0; i < this.canvasWidth; i += _gap) {
      _ctx.beginPath();
      _ctx.moveTo(i, 0);
      _ctx.lineTo(i, this.canvasHeight);
      _ctx.stroke();
      _ctx.closePath();
    }
    _ctx.stroke();
  }
  justifyAllCoordinate() {
    let groups = this.canvas.groups;
    let nodes = this.canvas.nodes;

    let _justifyItem = (item, type) => {
      let _sx = item.left;
      let _sy = item.top;
      let _ex = item.left + item.getWidth();
      let _ey = item.top + item.getHeight();

      let _left = _sx % this.theme.gap;
      let _right = _ex % this.theme.gap;
      let _top = _sy % this.theme.gap;
      let _bottom = _ey % this.theme.gap;
      let _posLeft = this.theme.gap - _left;
      let _posRight = this.theme.gap - _right;
      let _posTop = this.theme.gap - _top;
      let _posBottom = this.theme.gap - _bottom;

      let _pos = {
        left: Infinity,
        right: Infinity,
        top: Infinity,
        bottom: Infinity
      };

      if (_left < _right && _left < _pos['left']) {
        _pos['left'] = _left;
      }
      if (_posLeft < _left && _posLeft < _pos['right']) {
        _pos['right'] = _posLeft;
      }

      if (_right < _left && _right < _pos['right']) {
        _pos['left'] = _right;
      }
      if (_posRight < _right && _posRight < _pos['left']) {
        _pos['right'] = _posRight;
      }

      if (_top < _bottom && _top < _pos['top']) {
        _pos['top'] = _top;
      }
      if (_posTop < _top && _posTop < _pos['bottom']) {
        _pos['bottom'] = _posTop;
      }

      if (_bottom < _top && _bottom < _pos['bottom']) {
        _pos['top'] = _bottom;
      }
      if (_posBottom < _bottom && _posBottom < _pos['top']) {
        _pos['bottom'] = _posBottom;
      }

      let result = [item.left, item.top];

      _pos['left'] = _pos['left'] <= this.theme.adsorbGap ? _pos['left'] : Infinity;
      _pos['right'] = _pos['right'] <= this.theme.adsorbGap ? _pos['right'] : Infinity;
      _pos['top'] = _pos['top'] <= this.theme.adsorbGap ? _pos['top'] : Infinity;
      _pos['bottom'] = _pos['bottom'] <= this.theme.adsorbGap ? _pos['bottom'] : Infinity;

      _pos['left'] < _pos['right'] && (result[0] -= _pos['left']);
      _pos['right'] < _pos['left'] && (result[0] += _pos['right']);
      _pos['top'] < _pos['bottom'] && (result[1] -= _pos['top']);
      _pos['bottom'] < _pos['top'] && (result[1] += _pos['bottom']);

      if (result[0] !== item.left || result[1] !== item.top) {
        if (type === 'node') {
          this.canvas._moveNode(item, result[0], result[1]);
        } else if (type === 'group') {
          this.canvas._moveGroup(item, result[0], result[1]);
        }
      }
    };

    groups.forEach((_group) => {
      _justifyItem(_group, 'group');
      (_group.nodes || []).forEach((_node) => {
        _justifyItem(_node, 'node');
      });
    });

    nodes.forEach((_node) => {
      _justifyItem(_node, 'node');
    });
  }
  destroy() {
    this.dom.remove();
    this.isActive = false;
  }
}

module.exports = GridService;
