'use strict';

import Node from './baseNode';

class TreeNode extends Node {
  constructor(options) {
    super(options);
    this.children = options.children;
    this.parent = options.parent;
    this.collapsed = options.collapsed || false;
    if (options.isRoot) {
      this.isRoot = options.isRoot;
    }
  }
  _init(obj = {}) {
    super._init(obj);
    if (obj.parent) {
      this.parent = obj.parent;
      this.options.parent = obj.parent;
    }
  }
  collapse() {
    this._emit('InnerEvents', {
      type: 'node:collapse',
      nodeId: this.id
    });
    this.collapsed = true;
  }
  expand(nodes = []) {
    this._emit('InnerEvents', {
      type: 'node:expand',
      nodeId: this.id,
      nodes: nodes
    });
    delete this.collapsed;
  }
  detectLeaf() {
    return !!!(this.children && this.children.length > 0);
  }
  detectRoot() {
    return this.isRoot;
  }
}

export default TreeNode;