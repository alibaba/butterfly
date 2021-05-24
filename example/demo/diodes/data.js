import Info from './node_info';
import Semiconductor from './node_semiconductor';
import Edge from './edge';

export default {
  nodes: [{
    id: '0',
    top: 50,
    left: 10,
    type: 'input',
    Class: Info
  }, {
    id: '1',
    top: 170,
    left: 150,
    type: 'semiconductor_1',
    Class: Semiconductor,
    inputs: [{
      id: '0'
    }],
    outputs: [{
      id: '1'
    }]
  }, {
    id: '2',
    top: 230,
    left: 380,
    type: 'semiconductor_2',
    Class: Semiconductor,
    inputs: [{
      id: '0'
    }, {
      id: '1'
    }],
    outputs: [{
      id: '2'
    }]
  }, {
    id: '3',
    top: 40,
    left: 590,
    type: 'semiconductor_3',
    Class: Semiconductor,
    inputs: [{
      id: '0'
    }],
    outputs: [{
      id: '1'
    }]
  }, {
    id: '4',
    top: 65,
    left: 780,
    type: 'semiconductor_4',
    Class: Semiconductor,
    inputs: [{
      id: '0'
    }, {
      id: '1'
    }],
    outputs: [{
      id: '2'
    }]
  }, {
    id: '5',
    top: 130,
    left: 780,
    type: 'semiconductor_5',
    Class: Semiconductor,
    inputs: [{
      id: '0'
    }, {
      id: '1'
    }],
    outputs: [{
      id: '2'
    }]
  }, {
    id: '6',
    top: 195,
    left: 780,
    type: 'semiconductor_6',
    Class: Semiconductor,
    inputs: [{
      id: '0'
    }, {
      id: '1'
    }],
    outputs: [{
      id: '2'
    }]
  }, {
    id: '7',
    top: 260,
    left: 780,
    type: 'semiconductor_7',
    Class: Semiconductor,
    inputs: [{
      id: '0'
    }, {
      id: '1'
    }],
    outputs: [{
      id: '2'
    }]
  }, {
    id: '8',
    top: 325,
    left: 780,
    type: 'semiconductor_8',
    Class: Semiconductor,
    inputs: [{
      id: '0'
    }, {
      id: '1'
    }],
    outputs: [{
      id: '2'
    }]
  }, {
    id: '9',
    top: 400,
    left: 570,
    type: 'output',
    Class: Info
  }],
  edges: [{
    source: '0',
    target: '1',
    sourceNode: '0',
    targetNode: '1',
    color: 'purple',
    type: 'endpoint',
    Class: Edge
  }, {
    source: '0',
    target: '1',
    sourceNode: '1',
    targetNode: '2',
    type: 'endpoint',
    Class: Edge
  }, {
    source: '0',
    target: '1',
    sourceNode: '2',
    targetNode: '3',
    type: 'endpoint',
    Class: Edge
  }, {
    source: '0',
    target: '0',
    sourceNode: '2',
    targetNode: '9',
    type: 'endpoint',
    Class: Edge
  }, {
    source: '0',
    target: '2',
    sourceNode: '3',
    targetNode: '2',
    color: 'purple',
    type: 'endpoint',
    Class: Edge
  }]
};

