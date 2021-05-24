import Node from './node.js';
import Edge from './edge';

export default {
  nodes: [
    {
      id: '1',
      label: 'Number',
      className: 'icon-background',
      iconType: 'icon-wo',
      top: 25,
      left: 380,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '2',
      label: 'Name',
      className: 'icon-background',
      iconType: 'icon-wo',
      top: 25,
      left: 520,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '3',
      label: 'Skills',
      className: 'icon-background',
      iconType: 'icon-wo',
      top: 25,
      left: 660,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '4',
      label: 'Employee',
      className: 'icon-background',
      iconType: 'icon-guanlian',
      top: 125,
      left: 520,
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
      id: '5',
      label: 'Gets Paid',
      className: 'icon-background',
      iconType: 'icon-rds',
      top: 125,
      left: 740,
      Class: Node,
      endpoints: [{
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }, {
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '6',
      label: 'Wage',
      className: 'icon-background',
      iconType: 'icon-guanlian',
      top: 125,
      left: 960,
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
      id: '7',
      label: 'Amount',
      className: 'icon-background',
      iconType: 'icon-wo',
      top: 225,
      left: 800,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '8',
      label: 'Date',
      className: 'icon-background',
      iconType: 'icon-wo',
      top: 225,
      left: 1120,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '9',
      label: 'Salesman',
      className: 'icon-background',
      iconType: 'icon-guanlian',
      top: 275,
      left: 520,
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
      label: 'User',
      className: 'icon-background',
      iconType: 'icon-guanlian',
      top: 425,
      left: 520,
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
      label: 'Company',
      className: 'icon-background',
      iconType: 'icon-guanlian',
      top: 575,
      left: 520,
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
      label: 'Plate',
      className: 'icon-background',
      iconType: 'icon-wo',
      top: 725,
      left: 520,
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
      targetNode: '4',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '2',
      targetNode: '4',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '3',
      targetNode: '4',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'right',
      target: 'left',
      label: 1,
      sourceNode: '4',
      targetNode: '5',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'right',
      target: 'left',
      label: 'N',
      sourceNode: '5',
      targetNode: '6',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '6',
      targetNode: '7',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '6',
      targetNode: '8',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      label: 'ISA',
      sourceNode: '4',
      targetNode: '9',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      label: '0..1',
      sourceNode: '9',
      targetNode: '10',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      label: '1..1',
      sourceNode: '10',
      targetNode: '11',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.2,
      Class: Edge
    },
    {
      source: 'bottom',
      target: 'top',
      sourceNode: '11',
      targetNode: '12',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
  ]
};

