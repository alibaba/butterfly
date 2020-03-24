'use strict';

const Edge = require('./edge');
const BaseEndpoint = require('./endpoint');
import Node from './node';
import BaseGroup from './group';

export default {
  nodes: [{
    id: '0',
    top: 100,
    left: 100,
    width: 70,
    height: 30,
    text: 'A + B',
    Class: Node,
    endpoints: [{
      id: 'right',
      orientation: [1, 0],
      pos: [0, 0.5],
      color: 'system-green',
      Class: BaseEndpoint
    }]
  }, {
    id: '1',
    top: 100,
    left: 250,
    height: 90,
    width: 140,
    text: 'A + B + C',
    Class: Node,
    endpoints: [{
      id: 'left_2',
      orientation: [-1, 0],
      pos: [0, 0.55],
      color: 'system-green',
      Class: BaseEndpoint
    }, {
      id: 'left_3',
      orientation: [-1, 0],
      pos: [0, 0.8],
      color: 'system-green',
      Class: BaseEndpoint
    }, {
      id: 'right_1',
      orientation: [1, 0],
      pos: [0, 0.7],
      color: 'system-green',
      Class: BaseEndpoint
    }]
  }, {
    id: 'knob',
    top: 200,
    left: 100,
    height: 100,
    width: 70,
    text: 'Knob',
    Class: Node,
    endpoints: [{
      id: 'knbo_1',
      orientation: [1, 0],
      pos: [0, 0.5],
      color: 'system-green',
      Class: BaseEndpoint
    }]
  }, {
    id: 'gamepad',
    top: 216,
    left: 250,
    height: 100,
    width: 200,
    endPointLabel: [{
      endpoint: 'greenDom_0',
      label: 'left_x_axis',
    }, {
      endpoint: 'grayDom_1',
      label: 'left_y_axis',
    }, {
      endpoint: 'grayDom_2',
      label: 'button_pressed'
    }],
    text: 'Gamepad',
    Class: Node,
  }, {
    id: 'testGroup1',
    top: 36,
    left: 341,
    height: 70,
    width: 100,
    text: 'Flat Slots1',
    group: 'testGroup',
    Class: Node,
    endpoints: [{
      id: 'testGroup1_01',
      orientation: [0, -1],
      pos: [0.5, 0],
      color: 'system-green',
      Class: BaseEndpoint // 绿色系统锚点
    }, {
      id: 'testGroup1_02',
      orientation: [0, 1],
      pos: [0.33, 0],
      color: 'system-green',
      Class: BaseEndpoint // 绿色系统锚点
    }, {
      id: 'testGroup1_03',
      orientation: [0, 1],
      pos: [0.66, 0],
      color: 'system-green',
      Class: BaseEndpoint // 绿色系统锚点
    }]
  }, {
    id: 'testGroup2',
    top: 128,
    left: 237,
    height: 70,
    width: 100,
    text: 'Flat Slots2',
    group: 'testGroup',
    Class: Node,
    endpoints: [{
      id: 'testGroup2_01',
      orientation: [0, -1],
      pos: [0.5, 0],
      color: 'system-green',
      Class: BaseEndpoint // 绿色系统锚点
    }, {
      id: 'testGroup2_02',
      orientation: [0, 1],
      pos: [0.33, 0],
      color: 'system-gray',
      Class: BaseEndpoint // 灰色系统锚点
    }, {
      id: 'testGroup2_03',
      orientation: [0, 1],
      pos: [0.66, 0],
      color: 'system-gray',
      Class: BaseEndpoint // 灰色系统锚点
    }]
  }, {
    id: 'testGroup3',
    top: 128,
    left: 420,
    height: 70,
    width: 100,
    text: 'Flat Slots3',
    group: 'testGroup',
    Class: Node,
    endpoints: [{
      id: 'testGroup3_01',
      orientation: [0, -1],
      pos: [0.5, 0],
      color: 'system-green',
      Class: BaseEndpoint // 绿色系统锚点
    }, {
      id: 'testGroup3_02',
      orientation: [0, 1],
      pos: [0.33, 0],
      color: 'system-gray',
      Class: BaseEndpoint // 灰色系统锚点
    }, {
      id: 'testGroup3_03',
      orientation: [0, 1],
      pos: [0.66, 0],
      color: 'system-gray',
      Class: BaseEndpoint // 灰色系统锚点
    }]
  }, {
    id: 'widgest',
    top: 40,
    left: 24,
    width: 150,
    height: 170,
    text: 'Widgest',
    group: 'testGroup',
    Class: Node,
  }, {
    id: 'logEvent',
    top: 226,
    left: 608,
    height: 80,
    width: 140,
    text: 'Log Event',
    Class: Node,
  }, {
    id: 'customShapes',
    top: 111,
    left: 568,
    height: 60,
    width: 140,
    text: 'Custom Shapes',
    Class: Node,
    endpoints: [{
      id: 'custom_01',
      orientation: [-1, 0],
      pos: [0, 0.8],
      color: 'system-green',
      Class: BaseEndpoint
    }]
  }],
  groups: [{
    id: 'testGroup',
    options: {
      text: 'Group'
    },
    top: 360,
    left: 100,
    Class: BaseGroup
  }],
  edges: [{
    source: 'right',
    target: 'left_2',
    sourceNode: '0',
    targetNode: '1',
    type: 'endpoint',
    Class: Edge
  }, {
    source: 'knbo_1',
    target: 'left_3',
    sourceNode: 'knob',
    targetNode: '1',
    type: 'endpoint',
    Class: Edge
  }, {
    source: 'testGroup3_01',
    target: 'testGroup1_03',
    sourceNode: 'testGroup3',
    targetNode: 'testGroup1',
    type: 'endpoint',
    Class: Edge
  }, {
    source: 'testGroup2_01',
    target: 'testGroup1_02',
    sourceNode: 'testGroup2',
    targetNode: 'testGroup1',
    type: 'endpoint',
    Class: Edge
  }, {
    source: 'widgest_1',
    target: 'testGroup1_01',
    sourceNode: 'widgest',
    targetNode: 'testGroup1',
    type: 'endpoint',
    Class: Edge
  }, {
    source: 'gamepad_1',
    target: 'log_event_01',
    sourceNode: 'gamepad',
    targetNode: 'logEvent',
    type: 'endpoint',
    Class: Edge
  }, {
    source: 'right_1',
    target: 'custom_01',
    sourceNode: '1',
    targetNode: 'customShapes',
    type: 'endpoint',
    Class: Edge
  }]
}