const $ = require('jquery');
const _ = require('lodash');

import Node from '../interface/node';
import Endpoint from '../endpoint/baseEndpoint';

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
    // 鸭子辨识手动判断类型
    this.__type = 'node';
    this._on = opts._on;
    this._emit = opts._emit;
    this._global = opts._global;
    // endpoint 这部分需要考虑
    this.endpoints = [];
    this._endpointsData = opts.endpoints;
    this._endpointLimitNum = opts._endpointLimitNum;
    // 标识是否在移动做，兼容冒泡
    this._isMoving = false;
    // 长宽
    this.width = undefined;
    this.height = undefined;
    this._isForceUpdateSize = false;
  }

  draw(obj) {
    let _dom = obj.dom;
    if (!_dom) {
      _dom = $('<div></div>')
        .attr('class', 'node')
        .attr('id', obj.id);
    }
    const node = $(_dom);
    if (obj.top !== undefined) {
      node.css('top', `${obj.top}px`);
    }
    if (obj.left !== undefined) {
      node.css('left', `${obj.left}px`);
    }
    this.updated && this.updated();
    return node[0];
  }

  focus() {}

  unFocus() {}

  addEndpoint(obj, isInited) {
    if (isInited) {
      this.emit('InnerEvents', {
        type: 'node:addEndpoint',
        data: obj,
        isInited
      });
      return obj;
    }
    // 这部分可能还需要想一下
    const EndpointClass = obj.Class || Endpoint;
    const endpoint = new EndpointClass(_.assign({
      limitNum: obj.limitNum || this._endpointLimitNum,
      _on: this._on,
      _emit: this._emit,
      _node: this,
      _global: this.global
    }, obj));
    this.emit('InnerEvents', {
      type: 'node:addEndpoint',
      data: endpoint
    });

    let nodeZindex = $(this.dom).css('z-index');

    if (nodeZindex !== 'auto') {
      $(endpoint.dom).css('z-index', Number(nodeZindex) + 1);
    }

    this.endpoints.push(endpoint);
    return endpoint;
  }

  removeEndpoint(pointId) {
    const rmEndpointIndex = _.findIndex(this.endpoints, point => point.id === pointId);
    if (rmEndpointIndex !== -1) {
      const rmEndpoint = this.endpoints.splice(rmEndpointIndex, 1)[0];
      this.emit('InnerEvents', {
        type: 'node:removeEndpoint',
        data: rmEndpoint
      });
      rmEndpoint.destroy();
      return rmEndpoint;
    }
  }

  getEndpoint(pointId, type) {
    return _.find(this.endpoints, (point) => {
      if (!point.type || point.type === 'onlyConnect') {
        return pointId === point.id;
      } else {
        return pointId === point.id && ((type && type === point.type) || !type);
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
    }
    if (!this._hasEventListener) {
      this._addEventListener();
      this._hasEventListener = true;
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
  moveTo(x, y, isNotEventEmit) {
    this.emit('InnerEvents', {
      type: 'node:move',
      node: this,
      x,
      y,
      isNotEventEmit
    });
  }

  getWidth(useCache) {
    if (!useCache || !this.width || this._isForceUpdateSize) {
      this.width = $(this.dom).outerWidth();
      this._isForceUpdateSize = false;
    }
    return this.width;
  }

  getHeight(useCache) {
    if (!useCache || !this.height || this._isForceUpdateSize) {
      this.height = $(this.dom).outerHeight();
      this._isForceUpdateSize = false;
    }
    return this.height;
  }

  _createEndpoint(isInited) {
    if (isInited) {
      this.endpoints.forEach(item => this.addEndpoint(item, isInited));
    } else if (this._endpointsData) {
      this._endpointsData.map(item => this.addEndpoint(item));
    }
  }

  _addEventListener() {
    // todo 做事件代理的形式
    $(this.dom).on('mousedown', (e) => {
      const LEFT_KEY = 0;
      if (e.button !== LEFT_KEY) {
        return;
      }
      if (!['SELECT', 'INPUT', 'RADIO', 'CHECKBOX', 'TEXTAREA'].includes(e.target.nodeName)) {
        e.preventDefault();
      }
      if (this.draggable) {
        this._isMoving = true;
        this.emit('InnerEvents', {
          type: 'node:dragBegin',
          data: this
        });
      } else {
        // 单纯为了抛错事件给canvas，为了让canvas的dragtype不为空，不会触发canvas:click事件
        this.emit('InnerEvents', {
          type: 'node:mouseDown',
          data: this
        });
      }
    });

    $(this.dom).on('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.emit('system.node.click', {
        node: this
      });
      this.emit('events', {
        type: 'node:click',
        node: this
      });
    });

    this.setDraggable(this.draggable);
  }
  setDraggable(draggable) {
    this.draggable = draggable;
  }
  remove() {
    this.emit('InnerEvents', {
      type: 'node:delete',
      data: this
    });
  }
  emit(type, data) {
    super.emit(type, data);
    this._emit(type, data);
  }
  on(type, callback) {
    super.on(type, callback);
    this._on(type, callback);
  }
  destroy(isNotEvent) {
    if (!isNotEvent) {
      this.endpoints.forEach((item) => {
        !item._isInitedDom && item.destroy();
      });
      $(this.dom).remove();
      this.removeAllListeners();
      this._hasEventListener = false;
    } else {
      this.endpoints.forEach((item) => {
        !item._isInitedDom && item.destroy(isNotEvent);
      });
      $(this.dom).detach();
    }
    this._isInited = false;
  }
}

export default BaseNode;
