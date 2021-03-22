import Node from '../coms/node.js';
import Edge from '../coms/edge.js';
import Group from '../coms/group.js';

const process = ({nodes = [], edges = [], groups = []}) => {
  return {
    nodes: nodes.map((node) => {
      return {
        Class: Node,
        ...node,
      };
    }),
    edges: edges.map(edge => {
      const labelDOM = document.createElement('div');
      labelDOM.id = edge.id;

      return {
        type: 'endpoint',
        Class: Edge,
        ...edge,
      };
    }),
    groups: groups.map(group => {
      return {
        Class: Group,
        ...group,
      };
    })
  };
};

export default process;

