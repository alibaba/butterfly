'use strict';

require('./baseGroup.less');

const $ = require('jquery');
const _ = require('lodash');

const Group = require('../interface/group');
const Endpoint = require('../endpoint/baseEndpoint');

// scope的比较
const ScopeCompare = require('../utils/scopeCompare');

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
      this.setResize(true);
    }

    if (obj.top) {
      group.css('top', obj.top + 'px');
    }
    if (obj.left) {
      group.css('left', obj.left + 'px');
    }
    if (obj.width) {
      group.css('width', obj.width + 'px');
    }
    if (obj.height) {
      group.css('height', obj.height + 'px');
    }

    this.updated && this.updated();
    return group[0];
  }
  addNodes(nodes = []) {
    let _nodes = [];
    nodes.forEach((item) => {
      if (ScopeCompare(item.scope, this.scope, _.get(this, '_global.isScopeStrict'))) {
        _nodes.push(item);
      } else {
        console.log(`nodeId为${item.id}的节点和groupId${this.id}的节点组scope值不符，无法加入`);
      }
    });
    this._emit('InnerEvents', {
      type: 'group:addNodes',
      nodes: nodes,
      group: this
    });
  }
  addNode(node) {
    this.addNodes([node]);
  }
  removeNodes(nodes = []) {
    // 这里需要斟酌下
    let rmNodes = [];
    this.nodes.forEach((item) => {
      let _node = _.find(nodes, (_node) => {
        return _node.id === item.id;
      });
      if (_node) {
        rmNodes.push(_node);
        _node.dom.remove();
      }
    });
    this._emit('InnerEvents', {
      type: 'group:removeNodes',
      nodes: rmNodes
    });
    this.emit('events', {
      type: 'system.group.addMembers',
      nodes: [rmNode],
      group: targetGroup
    });
    this.emit('system.group.addMembers', {
      nodes: [rmNode],
      group: targetGroup
    });
    return rmNodes;
  }
  removeNode(node) {
    return this.removeNodes([node]);
  }
  setResize(flat, container = this.dom) {
    let mouseDown = (event) => {
      const LEFT_KEY = 0;
      if (event.button !== LEFT_KEY) {
        return;
      }
      event.preventDefault();
      // event.stopPropagation();
      this._emit('InnerEvents', {
        type: 'group:resize',
        group: this
      });
    };
    if (flat) {
      let icon = $('<span class="group-icon-resize butterfly-icon icon-drag"></span>')
        .appendTo(container);
      icon.on('mousedown', mouseDown);
    }
  }
  setSize(width = this.width, height = this.height) {
    this.width = width;
    this.height = height;
    $(this.dom).css('width', this.width).css('height', this.height);
  }
  remove() {
    this._emit('InnerEvents', {
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
  moveTo(x, y) {
    this._emit('InnerEvents', {
      type: 'group:move',
      group: this,
      x: x,
      y: y
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
      this._emit('system.group.click', {
        group: this
      });
      this._emit('events', {
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

      const LEFT_KEY = 0;
      if (e.button !== LEFT_KEY) {
        return;
      }
      e.preventDefault();
      // e.stopPropagation();
      this._emit('InnerEvents', {
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
      this._emit('InnerEvents', {
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

    this._emit('InnerEvents', {
      type: 'group:addEndpoint',
      data: endpoint,
    });
    this.endpoints.push(endpoint);
    return endpoint;
  }
  destroy() {
    this.endpoints.forEach((item) => {
      item.destroy();
    });
    $(this.dom).off();
    $(this.dom).remove();
    this._emit('system.group.delete', {
      group: this
    });
    this._emit('events', {
      type: 'group:delete',
      group: this
    });
  }
}

module.exports = BaseGroup;
