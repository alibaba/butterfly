'use strict';

const Node = require('./node.js');
const Edge = require('./edge');

module.exports = {
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
      id: '5',
      label: '时间处理',
      className: 'deep-blue',
      iconType: 'icon-shijian',
      top: 150,
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
      className: 'deep-blue',
      iconType: 'icon-webicon310',
      top: 150,
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
      id: '10',
      label: '交运算',
      className: 'deep-blue',
      iconType: 'icon-guanlian',
      top: 300,
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
      id: '13',
      label: '字符串处理',
      className: 'deep-blue',
      iconType: 'icon-shujuji',
      top: 450,
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
      className: 'deep-blue',
      iconType: 'icon-shujuji',
      top: 450,
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
  ]
};
