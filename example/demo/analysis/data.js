'use strict';
import Node from './node';
import Edge from './edge';

const data = {
  nodes: [
    {
      id: '1',
      label: 'common..',
      iconType: 'icon-rds',
      top: 25,
      left: 0,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '2',
      label: 'ticket_type',
      iconType: 'icon-rds',
      top: 25,
      left: 300,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '3',
      label: 'status',
      iconType: 'icon-rds',
      top: 25,
      left: 600,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '4',
      label: 'tql_1',
      iconType: 'icon-guize-kai',
      top: 200,
      left: 0,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '5',
      label: 'tql_2',
      iconType: 'icon-guize-kai',
      top: 200,
      left: 200,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '6',
      label: 'tql_3',
      iconType: 'icon-guize-kai',
      top: 200,
      left: 400,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '7',
      label: 'tql_4',
      iconType: 'icon-guize-kai',
      top: 200,
      left: 600,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '8',
      label: 'tql_5',
      iconType: 'icon-guize-kai',
      top: 200,
      left: 800,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '9',
      label: 'tql_6',
      iconType: 'icon-guize-kai',
      top: 200,
      left: 1000,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '10',
      label: 'tql_7',
      iconType: 'icon-guize-kai',
      top: 200,
      left: 1200,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '11',
      type: 'circle',
      top: 375,
      left: 38,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '12',
      type: 'circle',
      top: 375,
      left: 238,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '13',
      type: 'circle',
      top: 375,
      left: 438,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '14',
      type: 'circle',
      top: 375,
      left: 638,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '15',
      type: 'circle',
      top: 375,
      left: 838,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '16',
      type: 'circle',
      top: 375,
      left: 1038,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '17',
      type: 'circle',
      top: 375,
      left: 1238,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '18',
      label: '职业分布',
      iconType: 'icon-juxing',
      top: 550,
      left: 0,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '19',
      label: 'Echarts',
      iconType: 'icon-juxing',
      top: 550,
      left: 200,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '20',
      label: '国内国际',
      iconType: 'icon-juxing',
      top: 550,
      left: 400,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '21',
      label: '年龄分布',
      iconType: 'icon-juxing',
      top: 550,
      left: 600,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '22',
      label: '性别分布',
      iconType: 'icon-juxing',
      top: 550,
      left: 800,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '23',
      label: '省份分布',
      iconType: 'icon-juxing',
      top: 550,
      left: 1000,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '24',
      label: '国家分布',
      iconType: 'icon-juxing',
      top: 550,
      left: 1200,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
  ],
  edges: [{
    source: 'bottom',
    target: 'top',
    sourceNode: '1',
    targetNode: '4',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '1',
    targetNode: '5',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '1',
    targetNode: '6',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '1',
    targetNode: '7',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '1',
    targetNode: '8',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '1',
    targetNode: '9',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '1',
    targetNode: '10',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '2',
    targetNode: '4',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '3',
    targetNode: '5',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '3',
    targetNode: '6',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '3',
    targetNode: '7',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '3',
    targetNode: '8',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '3',
    targetNode: '9',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '3',
    targetNode: '10',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '4',
    targetNode: '11',
    label: 'rotate-down',
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '5',
    targetNode: '12',
    label: 'rotate-down',
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '6',
    targetNode: '13',
    label: 'rotate-down',
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '7',
    targetNode: '14',
    label: 'rotate-down',
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '8',
    targetNode: '15',
    label: 'rotate-down',
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '9',
    targetNode: '16',
    label: 'rotate-down',
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '10',
    targetNode: '17',
    label: 'rotate-down',
    type: 'endpoint',
    arrowPosition: 0.9,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '11',
    targetNode: '18',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.8,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '12',
    targetNode: '19',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.8,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '13',
    targetNode: '20',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.8,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '14',
    targetNode: '21',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.8,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '15',
    targetNode: '22',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.8,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '16',
    targetNode: '23',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.8,
    Class: Edge
  },
  {
    source: 'bottom',
    target: 'top',
    sourceNode: '17',
    targetNode: '24',
    arrow: true,
    type: 'endpoint',
    arrowPosition: 0.8,
    Class: Edge
  },
  ]
};
export default data;
