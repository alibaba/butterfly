'use strict';

const BaseNode = require('./node');
const BaseEdge = require('./edge');
const endpoints = [{
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
}, {
  id: 'left',
  orientation: [-1, 0],
  pos: [0, 0.5]
}];

module.exports = {
  nodes: [{
      id: '1',
      text: 'Gets Paid',
      top: 175,
      left: 550,
      color: 'purple',
      shape: 'diamond',
      Class: BaseNode,
      width: 70,
      height: 70,
      fill: '#776ef3',
      rectBorderWidth: 2,
      rectDasharray: 'none'
    }, {
      id: '2',
      text: 'Employee',
      top: 185,
      left: 300,
      color: 'green',
      shape: 'rect',
      Class: BaseNode,
      endpoints,
    }, {
      id: '3',
      text: 'Number',
      top: 90,
      left: 200,
      color: 'yellow',
      shape: 'ellipse',
      Class: BaseNode,
      endpoints
    }, {
      id: '4',
      text: 'Name',
      top: 30,
      left: 280,
      color: 'Orange',
      shape: 'ellipse',
      Class: BaseNode,
      endpoints
    }, {
      id: '5',
      text: 'Skills',
      top: 90,
      left: 350,
      width: 95,
      height: 45,
      color: 'yellow',
      shape: 'ellipse',
      Class: BaseNode,
      endpoints,
      fill: '#feb662',
      ellipseBorderWidth: 2,
      ellipseDasharray: 'none'
    }
    , {
      id: '6',
      text: 'ISA',
      top: 280,
      left: 320,
      color: 'Orange',
      shape: 'triangle',
      width: 100,
      height: 50,
      fill: '#fe8550',
      Class: BaseNode,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    }, {
      id: '7',
      text: 'Salesman',
      top: 370,
      left: 300,
      color: 'green',
      shape: 'rect',
      Class: BaseNode,
      endpoints,
    }, {
      id: '8',
      text: 'Uses',
      top: 360,
      left: 500,
      color: 'black',
      shape: 'diamond',
      Class: BaseNode,
      width: 70,
      height: 70,
      fill: '#797d9a',
    } , {
      id: '9',
      text: 'Company car',
      top: 370,
      left: 640,
      color: 'green',
      shape: 'rect',
      Class: BaseNode,
      endpoints,
    } , {
      id: '10',
      text: 'Plate',
      top: 460,
      left: 580,
      color: 'yellow',
      shape: 'ellipse',
      Class: BaseNode,
      endpoints
    },
    {
      id: '11',
      text: 'Wage',
      top: 185,
      left: 750,
      color: 'green',
      shape: 'rect',
      Class: BaseNode,
      endpoints,
      width: 135,
      height: 55,
      fill: '#31d0c6',
      rectBorderWidth: 2,
      rectDasharray: 'none'
    }, {
      id: '12',
      text: 'Amount',
      top: 90,
      left: 700,
      width: 95,
      height: 45,
      color: 'pink',
      shape: 'ellipse',
      Class: BaseNode,
      endpoints,
      fill: '#fca079',
      ellipseBorderWidth: 2,
      ellipseDasharray: '3 1'
    }, , {
      id: '13',
      text: 'Date',
      top: 90,
      left: 850,
      color: 'Orange',
      shape: 'ellipse',
      Class: BaseNode,
      endpoints
    }
  ],
  edges: [{
      source: 'left',
      target: 'right',
      sourceNode: '1',
      targetNode: '2',
      type: 'endpoint',
      color: 'black',
      arrowPosition: 1,
      label: '1',
      Class: BaseEdge
  }, {
      source: 'top',
      target: 'bottom',
      sourceNode: '2',
      targetNode: '3',
      type: 'endpoint',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    }, {
      source: 'top',
      target: 'bottom',
      sourceNode: '2',
      targetNode: '4',
      type: 'endpoint',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    }, {
      source: 'top',
      target: 'bottom',
      sourceNode: '2',
      targetNode: '5',
      type: 'endpoint',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    }, {
      source: 'bottom',
      target: 'top',
      sourceNode: '2',
      targetNode: '6',
      type: 'endpoint',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    }, {
      source: 'bottom',
      target: 'top',
      sourceNode: '6',
      targetNode: '7',
      type: 'endpoint',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    },{
      source: 'right',
      target: 'left',
      sourceNode: '7',
      targetNode: '8',
      type: 'endpoint',
      color: 'black',
      arrowPosition: 1,
      label: '0..1',
      Class: BaseEdge
    }, {
      source: 'right',
      target: 'left',
      sourceNode: '8',
      targetNode: '9',
      type: 'endpoint',
      color: 'black',
      arrowPosition: 1,
      label: '1..1',
      Class: BaseEdge
    }, {
      source: 'bottom',
      target: 'top',
      sourceNode: '9',
      targetNode: '10',
      type: 'endpoint',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    }, {
      source: 'right',
      target: 'left',
      sourceNode: '1',
      targetNode: '11',
      type: 'endpoint',
      color: 'black',
      arrowPosition: 1,
      label: 'N',
      Class: BaseEdge
    } , {
      source: 'top',
      target: 'bottom',
      sourceNode: '11',
      targetNode: '12',
      type: 'endpoint',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    }, {
      source: 'top',
      target: 'bottom',
      sourceNode: '11',
      targetNode: '13',
      type: 'endpoint',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    },
],
  groupd: []
}