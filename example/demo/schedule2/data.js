import Node from './node';
import Edge from './edge';

export default {
  nodes: [
    {
      id: '1',
      label: '某某算法',
      className: 'deep-blue',
      iconType: 'icon-kaifa',
      top: 150,
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
      className: 'deep-blue',
      iconType: 'icon-kaifa',
      top: 150,
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
      className: 'deep-blue',
      iconType: 'icon-kaifa',
      top: 150,
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
      className: 'deep-blue',
      iconType: 'icon-kaifa',
      top: 150,
      left: 650,
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
      className: 'deep-blue',
      iconType: 'icon-guanlian',
      top: 300,
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
      className: 'deep-blue',
      iconType: 'icon-shujuji',
      top: 300,
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
      className: 'deep-blue',
      iconType: 'icon-shujuji',
      top: 300,
      left: 650,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '11',
      label: '某某算法',
      className: 'deep-blue',
      iconType: 'icon-kaifa',
      top: 450,
      left: 200,
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
      className: 'deep-blue',
      iconType: 'icon-kaifa',
      top: 450,
      left: 350,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '15',
      label: '交运算',
      className: 'deep-blue',
      iconType: 'icon-guanlian',
      top: 600,
      left: 350,
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
};
