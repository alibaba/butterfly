'use strict';

const BaseNode = require('./node');
const BaseEdge = require('./edge');

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
    }, {
      id: '3',
      text: 'Number',
      top: 90,
      left: 200,
      color: 'yellow',
      shape: 'ellipse',
      Class: BaseNode,
    }, {
      id: '4',
      text: 'Name',
      top: 30,
      left: 280,
      color: 'Orange',
      shape: 'ellipse',
      Class: BaseNode,
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
    }, {
      id: '7',
      text: 'Salesman',
      top: 370,
      left: 300,
      color: 'green',
      shape: 'rect',
      Class: BaseNode,
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
    } , {
      id: '10',
      text: 'Plate',
      top: 460,
      left: 580,
      color: 'yellow',
      shape: 'ellipse',
      Class: BaseNode,
    },
    {
      id: '11',
      text: 'Wage',
      top: 185,
      left: 750,
      color: 'green',
      shape: 'rect',
      Class: BaseNode,
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
    }
  ],
  edges: [{
      source: '1',
      target: '2',
      type: 'node',
      color: 'black',
      arrowPosition: 1,
      label: '1',
      Class: BaseEdge
  },
   {
      source: '2',
      target: '3',
      type: 'node',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    }, {
      source: '2',
      target: '4',
      type: 'node',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    }, {
      source: '2',
      target: '5',
      type: 'node',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    }, {
      source: '2',
      target: '6',
      type: 'node',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    }, {
      source: '6',
      target: '7',
      type: 'node',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    },{
      source: '7',
      target: '8',
      type: 'node',
      color: 'black',
      arrowPosition: 1,
      label: '0..1',
      Class: BaseEdge
    }, {
      source: '8',
      target: '9',
      type: 'node',
      color: 'black',
      arrowPosition: 1,
      label: '1..1',
      Class: BaseEdge
    }, {
      source: '9',
      target: '10',
      type: 'node',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    }, {
      source: '1',
      target: '11',
      type: 'node',
      color: 'black',
      arrowPosition: 1,
      label: 'N',
      Class: BaseEdge
    } , {
      source: '11',
      target: '12',
      type: 'node',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    }, {
      source: '11',
      target: '13',
      type: 'node',
      color: 'black',
      arrowPosition: 1,
      Class: BaseEdge
    },
],
  groupd: []
}