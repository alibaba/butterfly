'use strict';

import Canvas from "./baseCanvas";

class TreeCanvas extends Canvas {
  _tranlate2Tree() {

  }
  draw(opts, options, callback) {
    const groups = opts.groups || [];
    const nodes = opts.nodes || [];
    const edges = opts.edges || [];

    // 自动布局需要重新review
    if (this.layout) {
      this._autoLayout({
        groups,
        nodes,
        edges
      });
    }

    // 首次加载，异步逐步加载
    let groupPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // 生成groups
        this.addGroups(groups);
        resolve();
      });
    });
    let nodePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // 生成nodes
        this.addNodes(nodes);
        resolve();
      }, 10);
    });
    let edgePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // 生成edges
        this.addEdges(edges);
        resolve();
      }, 20);
    });
    Promise.all([groupPromise, nodePromise, edgePromise]).then(() => {
      callback && callback({
        nodes: this.nodes,
        edges: this.edges,
        groups: this.groups
      });
    });
  }
  _autoLayout() {
    // 这部分需要优化
  }
}

export default TreeCanvas;