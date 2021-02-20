import Node from '../coms/node';
import Edge from '../coms/edge';
import Group from '../coms/group';
import diff from './diff'
import {addNodesCom , addEdgesCom , addGroupsCom} from './add-com'

const process = ({nodes = [], edges = [], groups = []}) => {
  return {
    nodes: nodes.map((node) => {
      return {
        ...node,
        Class: Node,
      };
    }),
    edges: edges.map(edge => {
      const labelDOM = document.createElement('div');
      labelDOM.id = edge.id;

      return {
        ...edge,
        type: 'endpoint',
        Class: Edge,
      };
    }),
    groups: groups.map(group => {
      return {
        ...group,
        Class: Group,
      };
    })
  };
};

/**
 * 
 * @param {Canvas} canvas 
 * @param {Array} nodes 新节点
 * @param {Array} oldNodes 老节点
 */
const processNodes = (canvas,nodes,oldNodes) => {
  const {created, deleted} = diff(nodes, oldNodes);

  canvas.addNodes(process({nodes: created}).nodes);
  addNodesCom({nodes: created}.nodes);

  canvas.removeNodes(process({nodes: deleted}).nodes);
};

const processEdge = (canvas,edges,oldEdges) => {
  const {created, deleted} = diff(edges, oldEdges);

  canvas.addEdges(process({edges: created}).edges, true);
  
  addEdgesCom({edges: created}.edges);

  canvas.removeEdges(process({edges: deleted}).edges.map(e => e.id));
};

const processGroups = (canvas,groups, oldGroups) => {
  const {created, deleted} = diff(groups, oldGroups);

  process({groups: created}).groups.forEach(group => {
    canvas.addGroup(group);
  });
  addGroupsCom({groups: created}.groups);

  process({groups: deleted}).groups.forEach(group => {
    canvas.removeGroup(group.id);
  });
};

export {
  process,
  processNodes,
  processEdge,
  processGroups
}