import nodeFactory from '../coms/node.js';
import edgeFactory from '../coms/edge.js';
import groupFactory from '../coms/group.js';

const processFactory = (uniqId = '') => (
  {
    nodes = [],
    edges = [],
    groups = [],
  }
) => {
  return {
    nodes: nodes.map((node) => {
      return {
        ...node,
        Class: nodeFactory(uniqId),
      };
    }),
    edges: edges.map(edge => {
      const labelDOM = document.createElement('div');
      labelDOM.id = edge.id;

      return {
        ...edge,
        type: 'endpoint',
        Class: edgeFactory(uniqId),
      };
    }),
    groups: groups.map(group => {
      return {
        ...group,
        Class: groupFactory(uniqId),
      };
    })
  };
};

export default processFactory;

