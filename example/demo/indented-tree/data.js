import Node from './node';

export default {
  nodes: {
    id: '0',
    isRoot: true,
    condition: 'and',
    desc: '企业经营异常记录数',
    Class: Node,
    endpoints: [{
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }, {
      id: 'bottom',
      orientation: [0, 1],
      pos: [0.5, 0]
    }],
    children: [{
      id: '1',
      condition: 'and',
      Class: Node,
      desc: '请选择指标',
      endpoints: [{
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }],
      children: [{
        id: '2',
        desc: '请选择指标',
        Class: Node,
        endpoints: [{
          id: 'left',
          orientation: [-1, 0],
          pos: [0, 0.5]
        }, {
          id: 'bottom',
          orientation: [0, 1],
          pos: [0.5, 0]
        }],
      }]
    }]
  },
  edges: [{
    id: '0',
    source: 'bottom',
    target: 'left',
    sourceNode: '0',
    targetNode: '1',
    type: 'endpoint'
  }, {
    id: '1',
    source: 'bottom',
    target: 'left',
    sourceNode: '1',
    targetNode: '2',
    type: 'endpoint'
  }]
};
