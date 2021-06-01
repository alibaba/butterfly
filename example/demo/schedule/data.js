import Node from './node';
import Edge from './edge';

export default {
  nodes: [
    {
      id: '1',
      label: '某某算法',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 50,
      left: 200,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '2',
      label: '某某算法',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 50,
      left: 350,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '3',
      label: '某某算法',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 50,
      left: 500,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '4',
      label: '某某算法',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 50,
      left: 650,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '5',
      label: '时间处理',
      className: 'icon-background-color',
      iconType: 'icon-shijian',
      top: 50,
      left: 800,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '6',
      label: '算数运算',
      className: 'icon-background-color',
      iconType: 'icon-webicon310',
      top: 50,
      left: 950,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '7',
      label: '交运算',
      className: 'icon-background-color',
      iconType: 'icon-guanlian',
      top: 200,
      left: 350,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '8',
      label: '字符串处理',
      className: 'icon-background-color',
      iconType: 'icon-shujuji',
      top: 200,
      left: 500,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '9',
      label: '字符串处理',
      className: 'icon-background-color',
      iconType: 'icon-shujuji',
      top: 200,
      left: 650,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '10',
      label: '交运算',
      className: 'icon-background-color',
      iconType: 'icon-guanlian',
      top: 200,
      left: 950,
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
      label: '某某算法',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 50,
      group: 'group',
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '12',
      label: '某某算法',
      className: 'icon-background-color',
      iconType: 'icon-kaifa',
      top: 55,
      left: 300,
      group: 'group',
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '13',
      label: '字符串处理',
      className: 'icon-background-color',
      iconType: 'icon-shujuji',
      top: 350,
      left: 800,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '14',
      label: '字符串处理',
      className: 'icon-background-color',
      iconType: 'icon-shujuji',
      top: 350,
      left: 950,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '15',
      label: '交运算',
      className: 'icon-background-color',
      iconType: 'icon-guanlian',
      top: 205,
      left: 300,
      group: 'group',
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
  ],
  edges: [
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '1',
      targetNode: '7',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '2',
      targetNode: '7',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '3',
      targetNode: '8',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '3',
      targetNode: '9',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '4',
      targetNode: '8',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '4',
      targetNode: '9',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '5',
      targetNode: '10',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '6',
      targetNode: '10',
      arrow: true,
      lineType: 'dash-line',
      type: 'endpoint',
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '10',
      targetNode: '13',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '10',
      targetNode: '14',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '11',
      targetNode: '15',
      arrow: true,
      lineType: 'dash-line',
      type: 'endpoint',
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '12',
      targetNode: '15',
      arrow: true,
      type: 'endpoint',
      arrowPosition: 0.5,
      Class: Edge
    },
  ],
  groups: [{
    id: 'group',
    options: {
      title: '测试'
    },
    draggable: false,
    top: 310,
    left: 185,
    width: 500,
    height: 300,
    resize: true
  }],
};

