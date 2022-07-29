import {TreeCanvas} from 'butterfly-dag';
import Node from '../coms/node';
import TreeNode from '../coms/tree-node';
import Edge from '../coms/edge';
import Group from '../coms/group';
import diff from './diff';
import relayout from './re-layout';
import {addNodesCom , addEdgesCom , addGroupsCom} from './add-com';

// treeNode还没有使用起来。待解决
const process = ({ nodes = [], edges = [], groups = [] , canvas = {}}) => {
  let BaseNode = Node;
  if (canvas.constructor === TreeCanvas) {
    BaseNode = TreeNode;
  }
  return {
    nodes: nodes.map((node) => {
      return {
        ...node,
        Class: BaseNode,
      };
    }),
    edges: edges.map(edge => {
      return {
        type: 'endpoint',
        ...edge,
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
 * @param {Object} parent butterfly-vue
 */
const processNodes = (canvas, nodes, oldNodes, parent) => {
  
  // 判断是TreeCanvas
  if (canvas.constructor === TreeCanvas) {
    // 对nodes进行拆解
    if(canvas.layout && canvas.previousIsFlatNode) {
      nodes = canvas._handleTreeNodes(nodes || [], _.get({}, 'isFlatNode', false))
    }
    relayout(canvas, nodes);
  }

 const { created, deleted } = diff(nodes, oldNodes);

  canvas.removeNodes(deleted.map(e => e.id), true);

  canvas.addNodes(process({nodes: created}).nodes);
  
  addNodesCom(canvas.root, canvas.getDataMap().nodes, {nodes: created}.nodes, parent);

};

const processEdge = (canvas, edges, oldEdges, parent) => {
  const { created, deleted } = diff(edges, oldEdges);

  canvas.removeEdges(deleted.map(e => e.id), true);

  canvas.addEdges(process({edges: created}).edges, true);
  
  addEdgesCom(canvas.root, {edges: created}.edges, parent);
};

const processGroups = (canvas, groups, oldGroups, parent) => {
  const {created, deleted} = diff(groups, oldGroups);

  process({groups: deleted}).groups.forEach(group => {
    canvas.removeGroup(group.id);
  });

  process({groups: created}).groups.forEach(group => {
    canvas.addGroup(group);
  });

  addGroupsCom(canvas.root, {groups: created}.groups, parent);
};

export {
  process,
  processNodes,
  processEdge,
  processGroups
};
