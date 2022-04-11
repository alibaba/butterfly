import node from './base_node';

export default {
  nodes: [{
    id: 'test1',
    name: 'test1',
    Class: node,
    className: 'nodeBackground-color'
  },
  {
    id: 'test2',
    name: 'test2',
    Class: node,
    className: 'nodeBackground-color'
  }, {
    id: 'test3',
    name: 'test3',
    Class: node,
    className: 'nodeBackground-color'
  }, {
    id: 'test4',
    name: 'test4',
    Class: node,
    className: 'nodeBackground-color'
  }, {
    id: 'test5',
    name: 'test5',
    Class: node,
    className: 'nodeBackground-color'
  }, {
    id: 'test6',
    name: 'test6',
    Class: node,
    className: 'nodeBackground-color'
  }, {
    id: 'test7',
    name: 'test7',
    Class: node,
    className: 'nodeBackground-color'
  }
  ],
  edges: [{
    source: 'test1',
    target: 'test2',
  },
  {
    source: 'test1',
    target: 'test3'
  }, {
    source: 'test2',
    target: 'test4'
  }, {
    source: 'test3',
    target: 'test4'
  }, {
    source: 'test4',
    target: 'test5'
  }, {
    source: 'test4',
    target: 'test6'
  },
  {
    source: 'test4',
    target: 'test7'
  }
  ]
};

