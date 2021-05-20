import Node from '../coms/node';
import Edge from '../coms/edge';
import Group from '../coms/group';
import diff from './diff';
import {addNodesCom , addEdgesCom , addGroupsCom} from './add-com';

const process = ({ nodes = [], edges = [], groups = [] }) => {
  return {
    nodes: nodes.map((node) => {
      return {
        ...node,
        Class: Node,
      };
    }),
    edges: edges.map(edge => {
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
const processNodes = (canvas, nodes, oldNodes, parent) => {
  // 对nodes进行拆解
  if(canvas.layout && canvas.layout.isFlatNode) {
    nodes = canvas._handleTreeNodes(nodes || [], _.get({}, 'isFlatNode', false))
  }
  
  // 自动布局
  canvas._autoLayout({nodes});

  const { created, deleted } = diff(nodes, oldNodes);

  canvas.removeNodes(deleted.map(e => e.id), true);

  canvas.addNodes(process({nodes: created}).nodes);
  
  addNodesCom(canvas.getDataMap().nodes,{nodes: created}.nodes, parent);

  canvas.nodes.forEach((item, index) => {
    item.left = nodes[index].left
    item.top = nodes[index].top
  })
};

const processEdge = (canvas, edges, oldEdges) => {
  const { created, deleted } = diff(edges, oldEdges);

  canvas.removeEdges(deleted.map(e => e.id), true);

  canvas.addEdges(process({edges: created}).edges, true);
  
  addEdgesCom({edges: created}.edges);
};

const processGroups = (canvas,groups,oldGroups) => {
  const {created, deleted} = diff(groups, oldGroups);

  process({groups: deleted}).groups.forEach(group => {
    canvas.removeGroup(group.id);
  });

  process({groups: created}).groups.forEach(group => {
    canvas.addGroup(group);
  });

  addGroupsCom({groups: created}.groups);
};

export {
  process,
  processNodes,
  processEdge,
  processGroups
};
