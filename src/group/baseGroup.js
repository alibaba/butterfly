'use strict';

import './baseGroup.less';

const $ = require('jquery');
const _ = require('lodash');

import Group from '../interface/group';
import Endpoint from '../endpoint/baseEndpoint';

// scope的比较
import ScopeCompare from '../utils/scopeCompare';

class BaseGroup extends Group {
  constructor(opts) {
    super(opts);
    this.id = opts.id;
    this.scope = opts.scope;
    this.top = opts.top;
    this.left = opts.left;
    this.width = opts.width || 300;
    this.height = opts.height || 150;
    this.resize = opts.resize;
    this.dom = null;
    this.nodes = [];
    this.options = opts.options;
    // 鸭子辨识手动判断类型
    this.__type = 'group';
    this._global = opts._global;
    this._on = opts._on;
    this._emit = opts._emit;
    this._container = null;
    // endpoint 这部分需要考虑
    this.endpoints = [];
    this._endpointsData = opts.endpoints;
  }
  init() {
    this.dom = this.draw({
      id: this.id,
      top: this.top,
      left: this.left,
      width: this.width,
      height: this.height,
      dom: this.dom,
      options: this.options
    });
    this._addEventListener();
  }
  draw(obj) {
    let _dom = obj.dom;
    if (!_dom) {
      _dom = $('<div></div>')
        .attr('class', 'group')
        .attr('id', obj.id);
    }
    let group = $(_dom);
    
    let titleDom = $('<div></div>')
      .attr('class', 'title');
    
    if (_.get(this, 'options.title')) {
      titleDom.text(_.get(this, 'options.title'));
    }

    group.append(titleDom);

    this._container = $('<div></div>')
      .attr('class', 'container');
    
    group.append(this._container);

    // 默认resize打开
    if (this.resize !== false) {
      this.setResize(true, group);
    }

    if (obj.top !== undefined) {
      group.css('top', obj.top + 'px');
    }
    if (obj.left !== undefined) {
      group.css('left', obj.left + 'px');
    }
    if (obj.width !== undefined) {
      group.css('width', obj.width + 'px');
    }
    if (obj.height !== undefined) {
      group.css('height', obj.height + 'px');
    }

    this.updated && this.updated();
    return group[0];
  }
  addNodes(nodes = [], isNotEventEmit) {
    let _nodes = [];
    nodes.forEach((item) => {
      if (ScopeCompare(item.scope, this.scope, _.get(this, '_global.isScopeStrict'))) {
        _nodes.push(item);
      } else {
        console.log(`nodeId为${item.id}的节点和groupId${this.id}的节点组scope值不符，无法加入`);
      }
    });
    this.emit('InnerEvents', {
      type: 'group:addNodes',
      nodes: nodes,
      group: this,
      isNotEventEmit
    });
  }
  addNode(node) {
    this.addNodes([node]);
  }
  removeNodes(nodes = [], isNotEventEmit) {
    let rmNodes = [];
    this.nodes.forEach((item) => {
      let _node = _.find(nodes, (_node) => {
        return _node.id === item.id;
      });
      if (_node) {
        rmNodes.push(_node);
      }
    })
    // this.nodes.forEach((item) => {
    //   let _node = _.find(nodes, (_node) => {
    //     return _node.id === item.id;
    //   });
    //   if (_node) {
    //     rmNodes.push(_node);
    //   }
    // });
    this.emit('InnerEvents', {
      type: 'group:removeNodes',
      group: this,
      nodes: rmNodes,
      isNotEventEmit
    });
    if (!isNotEventEmit) {
      this.emit('events', {
        type: 'system.group.removeNodes',
        group: this,
        nodes: rmNodes,
        group: targetGroup
      });
      this.emit('system.group.removeNodes', {
        group: this,
        nodes: rmNodes,
        group: targetGroup
      });
    }
    return rmNodes;
  }
  removeNode(node) {
    return this.removeNodes([node]);
  }
  setResize(flat, container = this.dom, resizeDom) {
    let mouseDown = (event) => {
      const LEFT_KEY = 0;
      if (event.button !== LEFT_KEY) {
        return;
      }
      event.preventDefault();
      // event.stopPropagation();
      this.emit('InnerEvents', {
        type: 'group:resize',
        group: this
      });
    };
    if (flat) {
      let icon = null;
      if (resizeDom) {
        icon = $(resizeDom);
        icon.addClass('butterfly-group-icon-resize');
      } else {
        icon = $('<span class="butterfly-group-icon-resize group-icon-resize butterfly-icon icon-drag"></span>')
      }
      icon.appendTo(container);
      icon.on('mousedown', mouseDown);
    }
  }
  setSize(width = this.width, height = this.height) {
    this.width = width;
    this.height = height;
    $(this.dom).css('width', this.width).css('height', this.height);
  }
  remove() {
    this.emit('InnerEvents', {
      type: 'group:delete',
      data: this
    });
  }
  _moveTo(x, y) {
    // 自身移动
    $(this.dom).css('top', y).css('left', x);
    // 所在节点的锚点移动
    this.nodes.forEach((node) => {
      node.endpoints.forEach((point) => {
        point.updatePos();
      });
    });
    // 节点组的锚点移动
    this.endpoints.forEach((item) => {
      item.moveTo(x - this.left + item._left, y - this.top + item._top);
    });
    this.top = y;
    this.left = x;
  }
  moveTo(x, y, isNotEventEmit) {
    this.emit('InnerEvents', {
      type: 'group:move',
      group: this,
      x,
      y,
      isNotEventEmit
    });
  }
  focus() {

  }
  unFocus() {
    
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }
  getEndpoint(pointId) {
    return _.find(this.endpoints, point => pointId === point.id);
  }
  _appendNodes(nodes = []) {
    nodes.forEach((item) => {
      item._group = this;
      item.group = this.id;
      $(this.dom).append(item.dom);
      this.nodes.push(item);
    });
  }
  _addEventListener() {
    $(this.dom).on('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.emit('system.group.click', {
        group: this
      });
      this.emit('events', {
        type: 'group:click',
        group: this
      });
    });
    $(this.dom).on('mousedown', (e) => {
      // 兼容节点冒泡上来的事件
      let isChildNodeMoving = _.some(this.nodes, (item) => {
        return item._isMoving;
      });
      if (isChildNodeMoving) {
        return;
      }
      // 兼容resize按钮冒泡上来的事件
      if(_.get(e, 'target.className', '').indexOf('butterfly-group-icon-resize') !== -1) {
        return;
      }

      const LEFT_KEY = 0;
      if (e.button !== LEFT_KEY) {
        return;
      }
      e.preventDefault();
      // e.stopPropagation();
      this.emit('InnerEvents', {
        type: 'group:dragBegin',
        data: this
      });
    });
  }
  _createEndpoint(isInited) {
    if (isInited) {
      this.endpoints.forEach(item => this.addEndpoint(item, isInited));
    } else if (this._endpointsData) {
      this._endpointsData.map(item => this.addEndpoint(item));
    }
  }
  addEndpoint(obj, isInited) {
    if (isInited) {
      this.emit('InnerEvents', {
        type: 'group:addEndpoint',
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
      _global: this._global,
    }, obj));

    this.emit('InnerEvents', {
      type: 'group:addEndpoint',
      data: endpoint,
    });
    this.endpoints.push(endpoint);
    return endpoint;
  }
  emit(type, data) {
    super.emit(type, data);
    this._emit(type, data);
  }
  destroy(isNotEventEmit) {
    this.endpoints.forEach((item) => {
      !item._isInitedDom && item.destroy();
    });
    $(this.dom).off();
    $(this.dom).remove();
    if (!isNotEventEmit) {
      this._emit('system.group.delete', {
        group: this
      });
      this._emit('events', {
        type: 'group:delete',
        group: this
      });
      this.removeAllListeners();
    }
  }
}

export default BaseGroup;
