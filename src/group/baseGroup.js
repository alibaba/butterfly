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
    this.draggable = opts.draggable;
    this.group = opts.group;
    this.dom = null;
    this.nodes = [];
    this.groups = [];
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
    // 标识是否在移动做，兼容冒泡
    this._isMoving = false;
  }
  _init(obj = {}) {
    if (this._isInited) {
      return;
    }
    if (obj.left) {
      this.left = obj.left;
    }
    if (obj.top) {
      this.top = obj.top;
    }
    if (obj.width) {
      this.width = obj.width;
    }
    if (obj.height) {
      this.height = obj.height;
    }
    this._isInited = true;
    if (obj._isDeleteGroup) {
      this.group = undefined;
      this._group = undefined;
    } else {
      obj.group && (this.group = obj.group);
    }
    if (obj.dom) {
      this.dom = obj.dom;
    }
    if (this.dom) {
      this.left && ($(this.dom).css('left', `${this.left}px`));
      this.top && ($(this.dom).css('top', `${this.top}px`));
      this.width && ($(this.dom).css('width', `${this.width}px`));
      this.height && ($(this.dom).css('height', `${this.height}px`));
    } else {
      this.dom = this.draw({
        id: this.id,
        top: this.top,
        left: this.left,
        width: this.width,
        height: this.height,
        dom: this.dom,
        options: this.options
      });
    }
    if (!this._hasEventListener) {
      this._addEventListener();
      this._hasEventListener = true;
    }
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
    // 节点组的锚点移动
    this.endpoints.forEach((item) => {
      item.moveTo(x - this.left + item._left, y - this.top + item._top);
    });
    
    // 所在节点或者节点组的锚点移动
    let allItems = (group) => {
      let result = [];
      let queue = [group];
      while(queue.length > 0) {
        let item = queue.pop();
        result = result.concat(item.nodes);
        result = result.concat(item.groups);
        queue = queue.concat(item.groups);
      }
      return result;
    }
    allItems(this).forEach((item) => {
      item.endpoints.forEach((point) => {
        point.updatePos();
      });
    })
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
  _appendChildren(children = []) {
    children.forEach((item) => {
      item._group = this;
      item.group = this.id;
      $(this.dom).append(item.dom);
      if (item.__type === 'node') {
        this.nodes.push(item);
      } else {
        this.groups.push(item);
      }
    });
  }
  _addEventListener() {
    // 节点组点击事件
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
    // 节点组鼠标点下事件
    $(this.dom).on('mousedown', (e) => {
      // 兼容节点冒泡上来的事件
      let allGroups = this.getSubGroup().concat(this);
      let isChildNodeMoving = false;
      for (let i = 0; i < allGroups.length; i++) {
        isChildNodeMoving = _.some(allGroups[i].nodes.concat(allGroups[i].groups), (item) => {
          return item._isMoving;
        });
        if (isChildNodeMoving) {
          break;
        }
      }
      if (isChildNodeMoving) {
        return;
      }
      // 兼容resize按钮冒泡上来的事件
      if($(e.target).attr('class').indexOf('butterfly-group-icon-resize') !== -1) {
        return;
      }

      const LEFT_KEY = 0;
      if (e.button !== LEFT_KEY) {
        return;
      }
      e.preventDefault();
      if (this._group) {
        e.stopPropagation();
      }
      if (this.draggable) {
        this._isMoving = true;
        this.emit('InnerEvents', {
          type: 'group:dragBegin',
          data: this
        });
      }
    });
  }
  _createEndpoint(isInited) {
    if (isInited) {
      this.endpoints.forEach(item => this.addEndpoint(item, isInited));
    } else if (this._endpointsData) {
      this._endpointsData.map(item => this.addEndpoint(item));
    }
  }
  getParentGroup() {
    let result = [];
    let targetGroup = this;
    while (targetGroup) {
      targetGroup = targetGroup._group;
      targetGroup && result.push(targetGroup);
    }
    return result;
  }
  getSubGroup() {
    let result = [];
    let queue = [this];
    while(queue.length > 0) {
      let group = queue.pop();
      result = result.concat(group.groups);
      queue = queue.concat(group.groups);
    }
    return result;
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
  on(type, callback) {
    super.on(type, callback);
    this._on(type, callback);
  }
  destroy(isNotEventEmit) {
    this.endpoints.forEach((item) => {
      !item._isInitedDom && item.destroy(isNotEventEmit);
    });
    if (!isNotEventEmit) {
      this._emit('system.group.delete', {
        group: this
      });
      this._emit('events', {
        type: 'group:delete',
        group: this
      });
      $(this.dom).off();
      $(this.dom).remove();
      this.removeAllListeners();
      this._hasEventListener = false;
    } else {
      $(this.dom).detach();
    }
    this._isInited = false;
  }
}

export default BaseGroup;
