'use strict';

const Node = require('./node.js');

module.exports = {
  nodes: {
    isRoot: true,
    id: 'Root',
    title: '根节点',
    Class: Node,
    children: [{
        id: 'subNode1',
        Class: Node,
        title: '子节点 1',
        side: "left",
      }, {
        id: 'subNode2',
        Class: Node,
        title: '子节点 2',
        side: "left",
        children: [{
            id: 'subNode2-1',
            Class: Node,
            title: '子节点 2-1',
            side: "right",
            children: [{
              id: 'subNode2-1-1',
              Class: Node,
              title: '子节点 2-1-1',
              side: "right",
            }]
          },
          {
            id: 'subNode2-2',
            Class: Node,
            title: '子节点 2-2',
            side: "right",
          }, {
            id: 'subNode2-3',
            Class: Node,
            title: '子节点 2-3',
            side: "right",
          }
        ]
      },
      {
        id: 'subNode3',
        Class: Node,
        title: '子节点 3',
        side: "left",
        children: [{
          id: 'subNode3-1',
          side: "left",
          Class: Node,
          title: '子节点 3-1',
        }]
      }, {
        id: 'subNode4',
        Class: Node,
        title: '子节点 4',
        side: "right",
        children: [{
          id: 'subNode4-1',
          Class: Node,
          side: "right",
          title: '子节点 4-1',
          children: [{
            id: 'subNode4-1-1',
            side: "right",
            Class: Node,
            title: '子节点 4-1-1',
          }, {
            id: 'subNode4-1-2',
            side: "right",
            Class: Node,
            title: '子节点 4-1-2',
          }, {
            id: 'subNode4-1-3',
            side: "right",
            Class: Node,
            title: '子节点 4-1-3',
          }, {
            id: 'subNode4-1-4',
            Class: Node,
            side: "right",
            title: '子节点 4-1-4',
          }]
        }, {
          id: 'subNode4-2',
          Class: Node,
          side: "right",
          title: '子节点 4-2',
        }, {
          id: 'subNode4-3',
          side: "right",
          Class: Node,
          title: '子节点 4-3',
        }, {
          id: 'subNode4-4',
          Class: Node,
          side: "right",
          title: '子节点 4-4',
        }]
      }
    ]
  },
  edges: [{
    id: '0',
    target: 'subNode1',
    source: 'Root',
    type: 'node',
  }, {
    id: '1',
    source: 'Root',
    target: 'subNode2',
    type: 'node'
  }, {
    id: '2',
    source: 'subNode2',
    target: 'subNode2-1',
    type: 'node'
  }, {
    id: '3',
    source: 'subNode2',
    target: 'subNode2-2',
    type: 'node'
  }, {
    id: '4',
    source: 'subNode2-3',
    target: 'subNode2',
    type: 'node'
  }, {
    id: '4',
    source: 'subNode2-1-1',
    target: 'subNode2-1',
    type: 'node'
  }, {
    id: '5',
    source: 'subNode3',
    target: 'Root',
    type: 'node'
  }, {
    id: '6',
    source: 'subNode3-1',
    target: 'subNode3',
    type: 'node'
  }, {
    id: '7',
    source: 'subNode4',
    target: 'Root',
    type: 'node'
  }, {
    id: '8',
    source: 'subNode4',
    target: 'subNode4-1',
    type: 'node'
  }, {
    id: '9',
    source: 'subNode4-2',
    target: 'subNode4',
    type: 'node'
  }, {
    id: '10',
    source: 'subNode4-3',
    target: 'subNode4',
    type: 'node'
  }, {
    id: '11',
    source: 'subNode4-4',
    target: 'subNode4',
    type: 'node'
  }, {
    id: '12',
    source: 'subNode4-1-1',
    target: 'subNode4-1',
    type: 'node'
  }, {
    id: '13',
    source: 'subNode4-1-2',
    target: 'subNode4-1',
    type: 'node'
  }, {
    id: '14',
    source: 'subNode4-1-3',
    target: 'subNode4-1',
    type: 'node'
  }, {
    id: '15',
    source: 'subNode4-1-4',
    target: 'subNode4-1',
    type: 'node'
  }]
};