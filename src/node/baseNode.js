const $ = require('jquery');
const _ = require('lodash');

const Node = require('../interface/node');
const Endpoint = require('../endpoint/baseEndpoint');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.id = opts.id;
    this.scope = opts.scope;
    this.group = opts.group;
    this.top = opts.top || 0;
    this.left = opts.left || 0;
    this.dom = opts.dom || null;
    this.draggable = opts.draggable;
    this.options = opts;
    this._on = opts._on;
    this._emit = opts._emit;
    this._global = opts._global;
    // endpoint 这部分需要考虑
    this.endpoints = [];
    this._endpointsData = opts.endpoints;
    // 标识是否在移动做，兼容冒泡
    this._isMoving = false;
  }

  draw(obj) {
    let _dom = obj.dom;
    if (!_dom) {
      _dom = $('<div></div>')
        .attr('class', 'node')
        .attr('id', obj.id);
    }
    const node = $(_dom);
    if (obj.top) {
      node.css('top', `${obj.top}px`);
    }
    if (obj.left) {
      node.css('left', `${obj.left}px`);
    }
    this.updated && this.updated();
    return node[0];
  }

  focus() {}

  unFocus() {}

  addEndpoint(obj, isInited) {
    if (isInited) {
      this._emit('InnerEvents', {
        type: 'node:addEndpoint',
        data: obj,
        isInited
      });
      return obj;
    } 
    // 这部分可能还需要想一下
    const EndpointClass = obj.Class || Endpoint;
    const endpoint = new EndpointClass(_.assign({
      _on: this._on,
      _emit: this._emit,
      _node: this,
      _global: this.global
    }, obj));

    this._emit('InnerEvents', {
      type: 'node:addEndpoint',
      data: endpoint,
    });
    this.endpoints.push(endpoint);
    return endpoint;
  }

  removeEndpoint(pointId) {
    const rmEndpointIndex = _.findIndex(this.endpoints, point => point.id === pointId);
    if (rmEndpointIndex !== -1) {
      const rmEndpoint = this.endpoints.splice(rmEndpointIndex, 1)[0];
      rmEndpoint.destroy();
      return rmEndpoint;
    }
  }

  getEndpoint(pointId, type) {
    return _.find(this.endpoints, (point) => {
      if (point.type) {
        return pointId === point.id && ((type && type === point.type) || !type);
      } else {
        return pointId === point.id;
      }
    });
  }

  _init(obj = {}) {
    if (this._isInited) {
      return;
    }
    // 这里可以抽象下，和constructor对比
    if (obj.left) {
      this.left = obj.left;
    }
    if (obj.top) {
      this.top = obj.top;
    }
    if (obj._isDeleteGroup) {
      this.group = undefined;
      this._group = undefined;
    } else {
      obj.group && (this.group = obj.group);
    }

    delete obj._isDeleteGroup;
    this._isInited = true;
    if (obj.dom) {
      this.dom = obj.dom;
      obj.left && ($(this.dom).css('left', `${obj.left}px`));
      obj.top && ($(this.dom).css('top', `${obj.top}px`));

    } else {
      this.dom = this.draw(_.assign({
        id: this.id,
        top: this.top,
        left: this.left,
        dom: this.dom,
        options: this.options
      }, obj));
  
      this._addEventListener();
    }
  }
  // drag的时候移动的api
  _moveTo(x, y) {
    // 自身移动
    $(this.dom).css('top', y).css('left', x);
    // 所在的点移动
    this.endpoints.forEach((item) => {
      item.moveTo(x - this.left + item._left, y - this.top + item._top);
    });
    this.top = y;
    this.left = x;
  }
  moveTo(x, y) {
    this._emit('InnerEvents', {
      type: 'node:move',
      node: this,
      x: x,
      y: y
    });
  }

  getWidth() {
    return $(this.dom).outerWidth();
  }

  getHeight() {
    return $(this.dom).outerHeight();
  }

  _createEndpoint(isInited) {
    if (isInited) {
      this.endpoints.forEach(item => this.addEndpoint(item, isInited));
    } else if (this._endpointsData) {
      this._endpointsData.map(item => this.addEndpoint(item));
    }
  }

  _addEventListener() {
    $(this.dom).on('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._emit('system.node.click', {
        node: this
      });
      this._emit('events', {
        type: 'node:click',
        node: this
      });
    });

    this.setDraggable(this.draggable);
  }
  setDraggable(draggable) {
    if (draggable === false) {
      $(this.dom).off('mousedown');
    } else {
      $(this.dom).on('mousedown', (e) => {
        const LEFT_KEY = 0;
        if (e.button !== LEFT_KEY) {
          return;
        }
        e.preventDefault();
        this._isMoving = true;
        this._emit('InnerEvents', {
          type: 'node:dragBegin',
          data: this
        });
      });
    }
    this.draggable = draggable;
  }
  remove() {
    this._emit('InnerEvents', {
      type: 'node:delete',
      data: this
    });
  }
  destroy(isNotEvent) {
    if (!isNotEvent) {
      this.endpoints.forEach((item) => {
        item.destroy();
      });
      $(this.dom).remove();
    } else {
      this.endpoints.forEach((item) => {
        !item._isInitedDom && item.destroy();
      });
      $(this.dom).detach();
    }
    this._isInited = false;
  }
}

module.exports = BaseNode;
