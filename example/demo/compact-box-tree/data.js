import Node from './node.js';

const mockData = {
  nodes: {
    isRoot: true,
    id: 'Root',
    title: '根节点',
    content: 'root',
    iconClass: 'icon-class',
    iconType: 'icon-shujuji',
    Class: Node,
    endpoints: [{
      id: '1',
      orientation: [0, 1],
      pos: [0.5, 0]
    }],
    children: [{
      id: 'subNode1',
      Class: Node,
      title: '子节点 1',
      content: 'sub node 1',
      // collapsed: true,
      iconType: 'icon-guize-kai',
      iconClass: 'icon-class',
      endpoints: [{
        id: '1',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: '2',
        orientation: [0, 1],
        pos: [0.5, 0]
      }],
      children: [{
        id: 'subNode1-1',
        Class: Node,
        title: '子节点 1-1',
        content: 'sub node 1-1',
        iconType: 'icon-guize-kai',
        iconClass: 'icon-class',
        endpoints: [{
          id: '1',
          orientation: [0, -1],
          pos: [0.5, 0]
        }, {
          id: '2',
          orientation: [0, 1],
          pos: [0.5, 0]
        }]
      }, {
        id: 'subNode1-2',
        Class: Node,
        title: '子节点 1-2',
        content: 'sub node 1-2',
        iconType: 'icon-guize-kai',
        iconClass: 'icon-class',
        endpoints: [{
          id: '1',
          orientation: [0, -1],
          pos: [0.5, 0]
        }, {
          id: '2',
          orientation: [0, 1],
          pos: [0.5, 0]
        }]
      }]
    }, {
      id: 'subNode2',
      Class: Node,
      title: '子节点 2',
      content: 'sub node 2',
      iconType: 'icon-guize-kai',
      iconClass: 'icon-class',
      // collapsed: true,
      endpoints: [{
        id: '1',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: '2',
        orientation: [0, 1],
        pos: [0.5, 0]
      }],
      children: [{
        id: 'subNode2-1',
        Class: Node,
        title: '子节点 2-1',
        content: 'sub node 2-1',
        iconType: 'icon-guize-kai',
        iconClass: 'icon-class',
        endpoints: [{
          id: '1',
          orientation: [0, -1],
          pos: [0.5, 0]
        }, {
          id: '2',
          orientation: [0, 1],
          pos: [0.5, 0]
        }]
      }, {
        id: 'subNode2-2',
        Class: Node,
        title: '子节点 2-2',
        content: 'sub node 2-2',
        iconType: 'icon-guize-kai',
        iconClass: 'icon-class',
        endpoints: [{
          id: '1',
          orientation: [0, -1],
          pos: [0.5, 0]
        }, {
          id: '2',
          orientation: [0, 1],
          pos: [0.5, 0]
        }]
      }]
    }, {
      id: 'subNode3',
      Class: Node,
      title: '子节点 3',
      content: 'sub node 3',
      iconType: 'icon-guize-kai',
      iconClass: 'icon-class',
      endpoints: [{
        id: '1',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: '2',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    }]
  },
  edges: [{
    id: '0',
    source: '1',
    target: '1',
    sourceNode: 'Root',
    targetNode: 'subNode1',
    type: 'endpoint'
  }, {
    id: '1',
    source: '1',
    target: '1',
    sourceNode: 'Root',
    targetNode: 'subNode2',
    type: 'endpoint'
  }, {
    id: '2',
    source: '1',
    target: '1',
    sourceNode: 'Root',
    targetNode: 'subNode3',
    type: 'endpoint'
  }, {
    id: '3',
    source: '2',
    target: '1',
    sourceNode: 'subNode1',
    targetNode: 'subNode1-1',
    type: 'endpoint'
  }, {
    id: '4',
    source: '2',
    target: '1',
    sourceNode: 'subNode1',
    targetNode: 'subNode1-2',
    type: 'endpoint'
  }, {
    id: '5',
    source: '2',
    target: '1',
    sourceNode: 'subNode2',
    targetNode: 'subNode2-1',
    type: 'endpoint'
  }, {
    id: '6',
    source: '2',
    target: '1',
    sourceNode: 'subNode2',
    targetNode: 'subNode2-2',
    type: 'endpoint'
  }]
};

export default mockData;
