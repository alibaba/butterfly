'use strict';

const Node = require('./node.js');

module.exports = {
  nodes: [{
    id: '0',
    name: 'API请求',
    type: 'black',
    top: 100,
    left: 500,
    data: {},
    endpoints: [{
      id: 'point_1',
      // type: 'tmp_source'
      // type: 'source',
    }],
    Class: Node
  }, {
    id: '1',
    name: '脚本abc_1',
    type: 'blue_1',
    top: 180,
    left: 500,
    // group: 'group_0',
    data: {},
    endpoints: [{
      id: 'point_1',
      // type: 'tmp_target'
      // type: 'source',
    }, {
      id: 'point_2',
      // type: 'target',
      // type: 'tmp_target',
      orientation: [0, 1],
      pos: [0.5, 0]
    }],
    Class: Node
  }, {
    id: '2',
    name: '路由',
    type: 'blue_2',
    top: 260,
    left: 420,
    data: {},
    endpoints: [{
      id: 'point_1',
      // type: 'target',
      orientation: [0, 1],
      pos: [0.5, 0]
    }, {
      id: 'point_2',
      orientation: [0, -1],
      pos: [0.33, 0]
      // type: 'source',
    }, {
      id: 'point_3',
      orientation: [0, -1],
      pos: [0.66, 0]
      // type: 'source',
    }],
    Class: Node
  }, {
    id: '3',
    name: '服务3',
    type: 'blue_3',
    top: 340,
    left: 380,
    data: {},
    endpoints: [{
      id: 'point_1',
      // type: 'source',
      scope: 'a'
    }, {
      id: 'point_2',
      // type: 'target',
      scope: 'a',
      orientation: [0, 1],
      pos: [0.5, 0]
    }],
    Class: Node
  }, {
    id: '4',
    name: 'API返回',
    type: 'green',
    data: {},
    top: 420,
    left: 380,
    endpoints: [{
      id: 'point_1',
      // type: 'source',
      orientation: [0, -1],
      pos: [0.5, 0]
    }, {
      id: 'point_2',
      orientation: [0, 1],
      pos: [0.5, 0]
      // type: 'target',
    }],
    Class: Node
  }, {
    id: '5',
    name: 'API返回_5',
    type: 'green',
    top: 420,
    left: 700,
    data: {},
    endpoints: [{
      id: 'point_1',
      orientation: [0, 1],
      pos: [0.5, 0],
      type: 'source',
      scope: 'b'
    }, {
      id: 'point_2',
      type: 'target',
      orientation: [0, -1],
      pos: [0.5, 0],
      scope: 'b'
    }],
    Class: Node
  }, {
    id: '6',
    name: 'group测试',
    type: 'green',
    top: 50,
    left: 50,
    data: {},
    endpoints: [{
      id: 'point_1',
      // type: 'source',
      // scope: 'b'
      orientation: [0, -1],
      pos: [0.5, 0]
    }, {
      id: 'point_2',
      orientation: [0, 1],
      pos: [0.5, 0]
      // type: 'target',
      // scope: 'b'
    }],
    group: 'group_1',
    Class: Node
  }],
  groups: [{
    id: 'group_1',
    options: {
      title: '测试'
    },
    top: 100,
    left: 100,
    resize: true
  }],
  edges: [
  //   {
  //   source: 'point_1',
  //   target: 'point_1',
  //   sourceNode: '0',
  //   targetNode: '2',
  //   type: 'endpoint'
  // }, {
  //   source: 'point_1',
  //   target: 'point_2',
  //   sourceNode: '0',
  //   targetNode: '1',
  //   type: 'endpoint'
  // }, 
  {
    source: 'point_1',
    target: 'point_1',
    sourceNode: '0',
    targetNode: '1',
    type: 'endpoint'
  }]
};
