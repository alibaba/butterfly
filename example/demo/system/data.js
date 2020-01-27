'use strict';

const BaseGroup = require('./group');
const BaseNode = require('./node');
const BaseEdge = require('./edge');
const BaseEndpoint = require('./endpoint');

module.exports = {
  nodes: [{
    id: '0',
    top: 160,
    left: 40,
    width: 80,
    height: 80,
    border: 'solid',
    text: 'ATOMIC',
    Class: BaseNode,
    endpoints: [{
      id: "right",
      orientation: [1, 0],
      pos: [0 ,0.5],
      Class: BaseEndpoint
    }]
  }, {
    id: '1',
    top: 200,
    left: 120,
    width: 80,
    height: 80,
    group: 'group_1',
    border: 'dashed',
    text: 'ATOMIC',
    Class: BaseNode,
    endpoints: [{
      id: "left",
      orientation: [-1, 0],
      pos: [0 ,0.5],
      Class: BaseEndpoint
    }, {
      id: "right_1",
      orientation: [1, 0],
      pos: [0 ,0.33],
      Class: BaseEndpoint
    }, {
      id: "right_2",
      orientation: [1, 0],
      pos: [0 ,0.66],
      Class: BaseEndpoint
    }]
  }, {
    id: '2',
    top: 50,
    left: 650,
    width: 100,
    height: 300,
    border: 'solid',
    text: 'ATOMIC',
    Class: BaseNode,
    endpoints: [{
      id: "left_1",
      orientation: [-1, 0],
      pos: [0 ,0.33],
      Class: BaseEndpoint
    }, {
      id: "left_2",
      orientation: [-1, 0],
      pos: [0 ,0.66],
      Class: BaseEndpoint
    }]
  }],
  groups: [{
    id: 'group_1',
    top: 50,
    left: 220,
    text: 'COUPLED',
    Class: BaseGroup,
    endpoints: [{
      id: "left",
      orientation: [-1, 0],
      pos: [0 ,0.5],
      Class: BaseEndpoint
    }, {
      id: "right_1",
      orientation: [1, 0],
      pos: [0 ,0.33],
      Class: BaseEndpoint
    }, {
      id: "right_2",
      orientation: [1, 0],
      pos: [0 ,0.66],
      Class: BaseEndpoint
    }]
  }],
  edges: [{
    source: 'right',
    target: 'left',
    sourceNode: '0',
    targetNode: 'group_1',
    type: 'endpoint',
    label: ['IN', 'OUT'],
    Class: BaseEdge
  }, {
    source: 'left',
    target: 'left',
    sourceNode: 'group_1',
    targetNode: '1',
    type: 'endpoint',
    label: [undefined, 'XY'],
    Class: BaseEdge
  }, {
    source: 'right_1',
    target: 'right_1',
    sourceNode: '1',
    targetNode: 'group_1',
    type: 'endpoint',
    label: ['X', 'OUT1'],
    Class: BaseEdge
  }, {
    source: 'right_2',
    target: 'right_2',
    sourceNode: '1',
    targetNode: 'group_1',
    type: 'endpoint',
    label: ['Y', 'OUT2'],
    Class: BaseEdge
  }, {
    source: 'right_1',
    target: 'left_1',
    sourceNode: 'group_1',
    targetNode: '2',
    type: 'endpoint',
    label: [undefined, 'A'],
    Class: BaseEdge
  }, {
    source: 'right_2',
    target: 'left_2',
    sourceNode: 'group_1',
    targetNode: '2',
    type: 'endpoint',
    label: [undefined, 'B'],
    Class: BaseEdge
  }]
}