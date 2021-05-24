import BaseNode from './node';
import BaseEdge from './edge';

export default {
  nodes: [{
    id: 0,
    name: '乙二醇MEG(液体)',
    type: 'grap',
    top: 50,
    left: 50,
    Class: BaseNode,
    iconType: 'icon-rds',
    circleColor: 'icon-background-color',
    endpoints: [{
      id: 'right',
      orientation: [1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: 1,
    name: 'PAT(粉末)',
    type: 'grap',
    top: 250,
    left: 50,
    Class: BaseNode,
    iconType: 'icon-rds',
    circleColor: 'icon-background-color',
    endpoints: [{
      id: 'right',
      orientation: [1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: 3,
    name: '第一酯化(260℃)',
    type: 'blue',
    top: 250,
    left: 300,
    Class: BaseNode,
    iconType: 'icon-shujuji',
    circleColor: 'icon-background-color',
    endpoints: [{
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }, {
      id: 'right',
      orientation: [1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: 4,
    name: '第二酯化(280℃)',
    type: 'blue',
    top: 250,
    left: 540,
    Class: BaseNode,
    iconType: 'icon-shujuji',
    circleColor: 'icon-background-color',
    endpoints: [{
      id: 'top',
      orientation: [0, -1],
      pos: [0.5, 0]
    }, {
      id: 'right',
      orientation: [1, 0],
      pos: [0, 0.5]
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: 7,
    name: '第二脂化(280℃)',
    type: 'blue',
    top: 250,
    left: 770,
    Class: BaseNode,
    iconType: 'icon-shujuji',
    circleColor: 'icon-background-color',
    endpoints: [{
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }, {
      id: 'right',
      orientation: [1, 0],
      pos: [0, 0.5]
    }, {
      id: 'bottom',
      orientation: [0, 1],
      pos: [0.5, 0]
    }]
  }, {
    id: 8,
    name: '聚酯熔体',
    type: 'blue',
    top: 250,
    left: 1000,
    Class: BaseNode,
    iconType: 'icon-juxing',
    circleColor: 'icon-background-color',
    endpoints: [{
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: 2,
    name: '乙二醇MEG(液体)',
    type: 'green',
    top: 450,
    left: 50,
    Class: BaseNode,
    iconType: 'icon-yun',
    circleColor: 'icon-background-color',
    endpoints: [{
      id: 'right',
      orientation: [1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: 5,
    name: '乙二醇MEG(液体)',
    type: 'blue',
    top: 50,
    left: 380,
    Class: BaseNode,
    iconType: 'icon-yun',
    circleColor: 'icon-background-color',
    endpoints: [{
      id: 'bottom',
      orientation: [0, 1],
      pos: [0.5, 0]
    }]
  }, {
    id: 6,
    name: '乙二醇MEG(液体)',
    type: 'blue',
    top: 50,
    left: 700,
    Class: BaseNode,
    iconType: 'icon-yun',
    circleColor: 'icon-background-color',
    endpoints: [{
      id: 'bottom',
      orientation: [0, 1],
      pos: [0.5, 0]
    }]
  }, {
    id: 9,
    name: '乙二醇MEG(液体)',
    type: 'blue',
    top: 450,
    left: 770,
    Class: BaseNode,
    iconType: 'icon-yun',
    circleColor: 'icon-background-color',
    endpoints: [{
      id: 'top',
      orientation: [0, -1],
      pos: [0.5, 0]
    }]
  }],
  edges: [{
    source: 'right',
    target: 'left',
    sourceNode: 0,
    targetNode: 3,
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: 1,
    targetNode: 3,
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: 2,
    targetNode: 3,
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: 3,
    targetNode: 4,
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: 4,
    targetNode: 7,
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: 7,
    targetNode: 8,
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'top',
    target: 'bottom',
    sourceNode: 9,
    targetNode: 7,
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: 5,
    targetNode: 4,
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: 6,
    targetNode: 4,
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }],
  groupd: []
};
