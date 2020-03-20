'use strict';

const BaseNode = require('./node');
const BaseEdge = require('./edge');

module.exports = {
  nodes: [{
    id: '0',
    text: 'Fire Incident',
    top: 10,
    left: 510,
    width: 100,
    height: 60,
    color: 'orange',
    shape: 'circle',
    border: 'dashed',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '1',
    text: 'Auto alarm activated?',
    top: 137,
    left: 500,
    width: 100,
    height: 60,
    color: 'purple',
    shape: 'diamond',
    border: 'solid',
    Class: BaseNode,
  }, {
    id: '2',
    text: 'Employees manually activates alarm',
    top: 150,
    left: 250,
    width: 100,
    height: 60,
    color: 'green',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '3',
    text: 'Activate evacuation',
    top: 150,
    left: 50,
    width: 100,
    height: 60,
    color: 'orange',
    shape: 'rect',
    border: 'dashed',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '4',
    text: 'Activate evacuation',
    top: 150,
    left: 750,
    width: 100,
    height: 60,
    color: 'orange',
    shape: 'rect',
    border: 'dashed',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '5',
    text: 'Employees informs primary contact',
    top: 280,
    left: 250,
    width: 100,
    height: 60,
    color: 'green',
    shape: 'rect',
    border: 'dashed',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '6',
    text: 'Evacuees report to Gathering Point / Safe Area',
    top: 330,
    left: 950,
    width: 100,
    height: 60,
    color: 'black',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '7',
    text: 'Alarm monitoring service provider contacts orangnization?',
    top: 380,
    left: 500,
    width: 100,
    height: 60,
    color: 'purple',
    shape: 'diamond',
    border: 'solid',
    Class: BaseNode,
  }, {
    id: '8',
    text: 'Roll call taken by team leads',
    top: 450,
    left: 950,
    width: 100,
    height: 60,
    color: 'black',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '9',
    text: 'Floor Marshals brief Crisis Management Team using floor plans',
    top: 570,
    left: 950,
    width: 100,
    height: 60,
    color: 'black',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '10',
    text: 'Primary contact contacts Fire Department',
    top: 500,
    left: 700,
    width: 100,
    height: 60,
    color: 'black',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '11',
    text: 'Primary contact informs Emergency Response Team',
    top: 620,
    left: 700,
    width: 100,
    height: 60,
    color: 'black',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '12',
    text: 'Emergency Response Team informs Crisis Management Team',
    top: 740,
    left: 700,
    width: 100,
    height: 60,
    color: 'black',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '13',
    text: 'Primary contact confirm fire incident',
    top: 610,
    left: 498,
    width: 100,
    height: 60,
    color: 'green',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '14',
    text: 'Service Provider contacts Frie Department',
    top: 730,
    left: 498,
    width: 100,
    height: 60,
    color: 'green',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '15',
    text: 'Fire Engines arrives',
    top: 850,
    left: 498,
    width: 100,
    height: 60,
    color: 'green',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '16',
    text: 'Cris Management Team Leader briefs Battalion Chief',
    top: 970,
    left: 498,
    width: 100,
    height: 60,
    color: 'green',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '17',
    text: 'Fire Department becomes Incident Commander',
    top: 630,
    left: 250,
    width: 100,
    height: 60,
    color: 'green',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '18',
    text: 'Fire Department gives All-Clear signal',
    top: 750,
    left: 250,
    width: 100,
    height: 60,
    color: 'green',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }, {
    id: '19',
    text: 'Crisis Management Team directs future actions',
    top: 870,
    left: 250,
    width: 100,
    height: 60,
    color: 'green',
    shape: 'rect',
    border: 'solid',
    Class: BaseNode,
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
    }, {
      id: 'left',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }],
  edges: [{
    source: 'bottom',
    target: 'top',
    sourceNode: '0',
    targetNode: '1',
    type: 'endpoint',
    color: 'black',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: '1',
    targetNode: '4',
    type: 'endpoint',
    color: 'black',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'left',
    target: 'right',
    sourceNode: '1',
    targetNode: '2',
    type: 'endpoint',
    color: 'purple',
    label: 'no',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '1',
    targetNode: '7',
    type: 'endpoint',
    color: 'purple',
    label: 'yes',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'left',
    target: 'right',
    sourceNode: '2',
    targetNode: '3',
    color: 'black',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '2',
    targetNode: '5',
    color: 'green',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'left',
    sourceNode: '5',
    targetNode: '7',
    color: 'green',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'right',
    target: 'top',
    sourceNode: '4',
    targetNode: '6',
    color: 'black',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '6',
    targetNode: '8',
    color: 'black',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '8',
    targetNode: '9',
    color: 'black',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'right',
    sourceNode: '9',
    targetNode: '16',
    color: 'black',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'right',
    target: 'top',
    sourceNode: '7',
    targetNode: '10',
    color: 'purple',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '10',
    targetNode: '11',
    color: 'black',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '11',
    targetNode: '12',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '7',
    targetNode: '13',
    color: 'purple',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '13',
    targetNode: '14',
    color: 'green',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '14',
    targetNode: '15',
    color: 'green',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '15',
    targetNode: '16',
    color: 'green',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'left',
    target: 'top',
    sourceNode: '16',
    targetNode: '17',
    color: 'green',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '17',
    targetNode: '18',
    color: 'green',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '18',
    targetNode: '19',
    color: 'green',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 1,
    Class: BaseEdge
  }],
  groupd: []
}