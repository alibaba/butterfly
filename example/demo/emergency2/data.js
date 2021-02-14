import BaseNode from './node';
import BaseEdge from './edge';

export default {
  nodes: [
    {
      id: '0',
      text: 'Fire Incident',
      top: 10,
      left: 520,
      width: 100,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    }, {
      id: '1',
      text: 'Auto alarm activated',
      top: 110,
      left: 500,
      width: 140,
      height: 30,
      shape: 'rect',
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
      id: '2',
      text: 'Employees manua…',
      top: 110,
      left: 200,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    }, {
      id: '3',
      text: 'Actiate evacuation',
      top: 110,
      left: 850,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
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
      text: 'Alarm monitoring service…',
      top: 210,
      left: 500,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
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
      text: 'Employees informs pri…',
      top: 210,
      left: 200,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }]
    }, {
      id: '6',
      text: 'Evacuees report …',
      top: 190,
      left: 850,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }, ]
    }, {
      id: '7',
      text: 'Roll call taken by …',
      top: 280,
      left: 850,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }, ]
    }, {
      id: '8',
      text: 'Floor Marshals brief…',
      top: 370,
      left: 850,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }],
    }, {
      id: '9',
      text: 'Primary contact con…',
      top: 310,
      left: 350,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }, ],
    }, {
      id: '10',
      text: 'Primary contect infor…',
      top: 410,
      left: 350,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }, ],
    }, {
      id: '11',
      text: 'Emergency response…',
      top: 510,
      left: 350,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }],
    }, {
      id: '12',
      text: 'Primary contact fire…',
      top: 310,
      left: 650,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }, ],
    }, {
      id: '13',
      text: 'Service Provider…',
      top: 410,
      left: 650,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }, ],
    }, {
      id: '14',
      text: 'Fire Engines arr…',
      top: 510,
      left: 650,
      width: 140,
      height: 30,
      shape: 'rect',
      Class: BaseNode,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }],
    }],

  edges: [{
    source: 'bottom',
    target: 'top',
    sourceNode: '0',
    targetNode: '1',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'left',
    target: 'right',
    sourceNode: '1',
    targetNode: '2',
    type: 'endpoint',
    arrow: true,
    label: 'No',
    arrowPosition: 0.7,
    Class: BaseEdge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: '1',
    targetNode: '3',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '1',
    targetNode: '4',
    type: 'endpoint',
    arrow: true,
    label: 'Yes',
    arrowPosition: 0.8,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '2',
    targetNode: '5',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: '5',
    targetNode: '4',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '3',
    targetNode: '6',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '6',
    targetNode: '7',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '7',
    targetNode: '8',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '9',
    targetNode: '10',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '10',
    targetNode: '11',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '12',
    targetNode: '13',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '13',
    targetNode: '14',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '4',
    targetNode: '9',
    type: 'endpoint',
    shapeType: 'AdvancedBezier',
    arrowPosition: 0.5,
    Class: BaseEdge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '4',
    targetNode: '12',
    type: 'endpoint',
    shapeType: 'AdvancedBezier',
    arrowPosition: 0.5,
    Class: BaseEdge
  }],
  groupd: []
};
