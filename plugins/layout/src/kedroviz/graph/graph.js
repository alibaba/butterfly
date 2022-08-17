/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
* Modifications Copyright 2022 butterfly-dag
*/
import { offsetNode } from './common';
import { layout } from './layout';
import { bounds } from '../selectors/size'


export const graph = (nodes, edges, layers, rankdir, isRankReverse, options) => {
  addEdgeLinks(nodes, edges);
  addNearestLayers(nodes, layers);

  layout({ nodes, edges, layers, rankdir, isRankReverse, ...options.layout });
  const size = bounds(nodes, options.layout.padding);
  nodes.forEach((node) => offsetNode(node, size.min));

  nodes.forEach((node) => node.x = node.x - (node.width * 0.5));
  nodes.forEach((node) => node.y = node.y - (node.height * 0.5));

  return {
    nodes,
    edges,
    layers,
    size
  };
};

export const addEdgeLinks = (nodes, edges) => {
  const nodeById = {};

  for (const node of nodes) {
    // if (node.fields) {
    //   node.fields.forEach(item => {
    //     item.targets = [];
    //     item.sources = [];
    //     nodeById[item.id] = item;
    //   });
    // }
    nodeById[node.id] = node;
    node.targets = [];
    node.sources = [];
  }

  for (const edge of edges) {
    let sourceNode = typeof(edge.sourceNode) !== 'undefined' ? edge.sourceNode : edge.source;
    let targetNode = typeof(edge.targetNode) !== 'undefined' ? edge.targetNode : edge.target;
    // if (edge._sourceEndPoint && edge._targetEndPoint) {
    //   sourceNode = edge._sourceEndPoint.replace(/[^\d]/g, " ");
    //   targetNode = edge._targetEndPoint.replace(/[^\d]/g, " ");
    //   edge.sourceNode = parseInt(sourceNode);
    //   edge.targetNode = parseInt(targetNode);
    // }
    edge.sourceNodeObj = nodeById[parseInt(sourceNode)];
    edge.targetNodeObj = nodeById[parseInt(targetNode)];
    edge.sourceNodeObj.targets.push(edge);
    edge.targetNodeObj.sources.push(edge);
  }
};

const findNodeBy = (node, successors, order, accept, visited) => {
  if (accept(node)) {
    return node;
  }

  visited = visited || {};
  visited[node.id] = true;

  const results = successors(node)
    .filter((successor) => !visited[successor.id])
    .sort(order)
    .map((successor) =>
      findNodeBy(successor, successors, order, accept, visited)
    )
    
    .filter(accept)
    
    .sort(order);


  return results[0];
};

const addNearestLayers = (nodes, layers) => {
  if (layers && layers.length > 0) {
    const validLayers = {};
    for (const layer of layers) {
      validLayers[layer] = true;
    }

    const hasValidLayer = (node) => Boolean(node && node.layer in validLayers);
    const lastLayer = layers[layers.length - 1];

    for (const node of nodes) {

      // 查找第一个子节点，该子节点具有符合顺序的有效层（包括其自身）
      const layerNode = findNodeBy(
        node,
        targetNodeObjs,
        orderRankAscending,
        hasValidLayer
      );

      // 指定最近的图层（如果找到），否则必须是最后一个图层
      node.nearestLayer = layerNode ? layerNode.layer : lastLayer;
    }
  }
};

const targetNodeObjs = (node) => node.targets.map((edge) => edge.targetNodeObj);

const orderRankAscending = (nodeA, nodeB) => nodeA.rank - nodeB.rank;

