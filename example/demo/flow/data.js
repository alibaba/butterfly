import Node from './node';
import Edge from './edge';

const mockData = {
  nodes: [
    {
      id: '1',
      label: '张三',
      left: 600,
      top: 50,
      iconType: 'icon-wo',
      Class: Node,
      endpoints: [{
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }, {
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '2',
      label: '查找联系人',
      left: 400,
      top: 50,
      iconType: 'icon-sousuo',
      Class: Node,
      endpoints: [{
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '3',
      label: '查找亲属',
      left: 600,
      top: 200,
      iconType: 'icon-sousuo',
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '4',
      label: '查找夫妻',
      left: 800,
      top: 50,
      iconType: 'icon-sousuo',
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }, {
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '5',
      label: '非日常同房',
      left: 400,
      top: 200,
      iconType: 'icon-xianshang',
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '6',
      label: '首次入系统',
      left: 600,
      top: 350,
      iconType: 'icon-xianshang',
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom1',
        orientation: [0, 1],
        pos: [0.3, 0]
      }, {
        id: 'bottom2',
        orientation: [0, 1],
        pos: [0.7, 0]
      }]
    },
    {
      id: '7',
      label: '非夫妻同房',
      left: 800,
      top: 200,
      iconType: 'icon-xianshang',
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '8',
      label: '嫌疑判断',
      left: 600,
      top: 500,
      iconType: 'icon-guanbi',
      Class: Node,
      endpoints: [{
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }, {
        id: 'top1',
        orientation: [0, -1],
        pos: [0.3, 0]
      }, {
        id: 'top2',
        orientation: [0, -1],
        pos: [0.7, 0]
      }]
    },
    {
      id: '9',
      label: '在逃人员...',
      left: 600,
      top: 650,
      iconType: 'icon-wo',
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    }
  ],
  edges: [
    {
      source: 'left',
      target: 'right',
      sourceNode: '1',
      targetNode: '2',
      type: 'endpoint',
      arrow: true,
      label: 'rotate-left',
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'right',
      target: 'left',
      sourceNode: '1',
      targetNode: '4',
      type: 'endpoint',
      arrow: true,
      label: 'rotate-right',
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '1',
      targetNode: '3',
      type: 'endpoint',
      arrow: true,
      label: 'rotate-down',
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '4',
      targetNode: '7',
      type: 'endpoint',
      arrow: true,
      label: 'rotate-down',
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'left',
      target: 'right',
      sourceNode: '7',
      targetNode: '3',
      type: 'endpoint',
      arrow: true,
      label: 'rotate-left',
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '2',
      targetNode: '5',
      type: 'endpoint',
      arrow: true,
      label: 'rotate-down',
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '3',
      targetNode: '6',
      type: 'endpoint',
      arrow: true,
      label: 'rotate-down',
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'right',
      target: 'left',
      sourceNode: '5',
      targetNode: '8',
      type: 'endpoint',
      arrow: true,
      label: 'rotate-down',
      arrowPosition: 0.1,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '8',
      targetNode: '9',
      type: 'endpoint',
      arrow: true,
      label: 'rotate-down',
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom1',
      target: 'top1',
      sourceNode: '6',
      targetNode: '8',
      type: 'endpoint',
      arrow: true,
      label: 'rotate-down',
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom2',
      target: 'top2',
      sourceNode: '6',
      targetNode: '8',
      type: 'endpoint',
      arrow: true,
      label: 'rotate-down',
      arrowPosition: 0.2,
      Class: Edge
    },
  ]
};

export default mockData;
