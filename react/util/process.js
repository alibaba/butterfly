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
        Class: nodeFactory(uniqId),
        ...node,
      };
    }),
    edges: edges.map(edge => {
      const labelDOM = document.createElement('div');
      labelDOM.id = edge.id;

      return {
        type: 'endpoint',
        Class: edgeFactory(uniqId),
        ...edge,
      };
    }),
    groups: groups.map(group => {
      return {
        Class: groupFactory(uniqId),
        ...group,
      };
    })
  };
};

export default processFactory;

