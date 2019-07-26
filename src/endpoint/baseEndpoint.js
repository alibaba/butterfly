

const $ = require('jquery');
const _ = require('lodash');
const coordinateService = require('../utils/coordinate');

require('./baseEndpoint.less');

class Endpoint {
  constructor(opts) {
    this.id = opts.id;
    this.options = opts;
    this.orientation = opts.orientation;
    this.pos = opts.pos;
    this.type = opts.type;
    this.nodeType = _.get(opts, 'nodeType', 'node');
    this.nodeId = _.get(opts, '_node.id');
    this.root = opts.root;
    this.scope = opts.scope;
    this.expandArea = opts.expandArea;
    this.options = opts;
    // 假如锚点在节点上则有值
    this._node = opts._node;
    this._global = opts._global;
    this._on = opts._on;
    this._emit = opts._emit;
    // 相对坐标
    this._top = 0;
    this._left = 0;
    // 相对于画布的绝对坐标
    this._posTop = 0;
    this._posLeft = 0;
    this._width = 0;
    this._height = 0;
    // 拉线时候可连接的标志
    this._linkable = false;

    // 不能断开线条
    if (this.type === 'target') {
      this._disLinkable = opts.disLinkable;
    }

    this._coordinateService = null;

    this.dom = null;
    this._isInitedDom = false;
    if (opts.dom) {
      this.dom = opts.dom;
      this._isInitedDom = true;
    }
  }

  _init(obj) {
    this._coordinateService = obj._coordinateService;
    
    if (obj.nodeType) {
      this.nodeType = obj.nodeType;
    }

    // 计算锚点起始值
    if (!this._isInitedDom) {
      this.dom = this.draw({
        id: this.id,
        orientation: this.orientation,
        pos: this.pos,
        dom: this.dom,
        root: this.root,
        type: this.type,
        options: this.options
      });
    } else {
      // 计算width,height,left,top
      this._width = $(this.dom).width();
      this._height = $(this.dom).height();
      this._left = this._coordinateService._terminal2canvas('x', $(this.dom).offset().left);
      this._top = this._coordinateService._terminal2canvas('y', $(this.dom).offset().top);

      this._posTop = this._top;
      this._posLeft = this._left;
    }

    this.attachEvent();
  }

  draw(obj) {
    let _dom = obj.dom;
    if (!_dom) {
      _dom = $('<div class="butterflie-circle-endpoint"></div>').attr('id', this.id);
    }
    return _dom;
  }

  updatePos(dom = this.dom, orientation = this.orientation, pos = this.pos) {
    if (this._isInitedDom) {
      // 计算width,height,left,top
      this._width = $(this.dom).width();
      this._height = $(this.dom).height();
      // 计算锚点起始值
      this._left = this._coordinateService._terminal2canvas('x', $(this.dom).offset().left);
      this._top = this._coordinateService._terminal2canvas('y', $(this.dom).offset().top);
      this._posLeft = this._left;
      this._posTop = this._top;
    } else {
      let _currentNode = this._node;
      let _currentDom = $(this._node.dom);
      let _currentNodeType = this.nodeType;

      // 分情况弄好方向和位置
      const nodeW = _currentDom.outerWidth();
      const nodeH = _currentDom.outerHeight();

      let targetDom = null;
      let targetDomW = 0;
      let targetDomH = 0;
      if (this.root) {
        targetDom = _currentDom.find(this.root);
        targetDomW = targetDom.width();
        targetDomH = targetDom.height();
      }

      this._width = $(dom).outerWidth();
      this._height = $(dom).outerHeight();

      // 计算节点本身的偏移量
      const eOffsetX = this._width / 2;
      const eOffsetY = this._height / 2;

      let _offsetTop = 0;
      let _offsetLeft = 0;

      const _orientation = orientation || this.orientation || [0, -1];
      const _pos = pos || this.pos || [_orientation[0] === 0 ? 0.5 : 0, _orientation[1] === 0 ? 0.5 : 0];

      const result = [0, 0];

      const _ox = _orientation[0];
      const _oy = _orientation[1];
      const _px = _pos[0];
      const _py = _pos[1];
      if (_ox === 0) {
        result[0] = !this.root ? nodeW * _px - eOffsetX : targetDomW * _px - eOffsetX;
      } else if (_ox === -1) {
        result[0] = 0 - eOffsetX;
      } else if (_ox === 1) {
        result[0] = !this.root ? nodeW - eOffsetX : targetDomW - eOffsetX;
      }

      if (_oy === 0) {
        result[1] = !this.root ? nodeH * _py - eOffsetY : targetDomH * _py - eOffsetY;
      } else if (_oy === -1) {
        result[1] = 0 - eOffsetY;
      } else if (_oy === 1) {
        result[1] = !this.root ? nodeH - eOffsetY : targetDomH - eOffsetY;
      }

      // 计算绝对定位
      if (_currentNode && !this.root) {
        _offsetTop += _currentNode.top;
        _offsetLeft += _currentNode.left;
      } else if (_currentNode && this.root) {
        // 计算传入的dom距离跟节点
        const nodeDomOffsets = _currentDom.offset();
        const targetDomOffsets = targetDom.offset();
        // 先计算目标节点和父节点得差值再加上父节点的offset
        _offsetTop += (targetDomOffsets.top - nodeDomOffsets.top + _currentNode.top);
        _offsetLeft += (targetDomOffsets.left - nodeDomOffsets.left + _currentNode.left);
      }
      this._top = result[1] + _offsetTop;
      this._left = result[0] + _offsetLeft;
      this._posTop = this._top;
      this._posLeft = this._left;
      if (_currentNodeType === 'node' && _currentNode._group) {
        this._posTop += _currentNode._group.top;
        this._posLeft += _currentNode._group.left;
      }

      $(dom)
        .css('top', this._top)
        .css('left', this._left);

      this.updated && this.updated();
    }
  }

  moveTo(x, y) {
    this._top = y;
    this._left = x;
    this._posTop = this._top;
    this._posLeft = this._left;
    if (!this._isInitedDom) {
      $(this.dom).css('top', y).css('left', x);
      if (_.get(this, '_node._group')) {
        this._posTop += this._node._group.top;
        this._posLeft += this._node._group.left;
      }
    }
  }

  linkable() {
    this.dom.addClass('linkable');
  }

  unLinkable() {
    this.dom.removeClass('linkable');
  }

  hoverLinkable() {
    this.dom.addClass('hover');
  }

  unHoverLinkable() {
    this.dom.removeClass('hover');
  }

  attachEvent() {
    if (this._disLinkable !== true) {
      $(this.dom).on('mousedown', (e) => {
        const LEFT_KEY = 0;
        if (e.button !== LEFT_KEY) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        this._emit('InnerEvents', {
          type: 'endpoint:drag',
          data: this
        });
      });
    }
  }

  destroy() {
    $(this.dom).off();
    $(this.dom).remove();
  }
}

module.exports = Endpoint;
