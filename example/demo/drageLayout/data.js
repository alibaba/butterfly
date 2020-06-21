'use strict';
const node = require('./base_node.jsx');
module.exports = {
  nodes: [{
    id: 'test1',
    name: 'test1',
    Class: node,
    color: '#c6e5ff'
  }, {
    id: 'test2',
    name: 'test2',
    Class: node,
    color: '#c6e5ff'
  }, {
    id: 'test3',
    name: 'test3',
    Class: node,
    color: '#c6e5ff'
  }, {
    id: 'test4',
    name: 'test4',
    Class: node,
    color: '#c6e5ff'
  }, {
    id: 'test5',
    name: 'test5',
    Class: node,
    color: '#c6e5ff'
  }, {
    id: 'test6',
    name: 'test6',
    Class: node,
    color: '#c6e5ff'
  }, {
    id: 'test7',
    name: 'test7',
    Class: node,
    color: '#c6e5ff'
  }
],
  edges: [{
    source: 'test1',
    target: 'test2'
  }, {
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
