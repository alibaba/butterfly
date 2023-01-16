import Node from './node';

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
        orientation: [0,- 1],
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
  }, 
]
};
 export default mockData;