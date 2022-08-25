/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
*/
import { getVisibleLayerIDs } from './disabled';
import batchingToposort from 'batching-toposort';

export const getLayerNodes = (node, layer) => {
  let nodeLayer = node.layer;
  let nodeIDs = node.ids;
  let layerIDs = layer.ids;
  if (!layerIDs.length) {
    return [];
  }
  const layerNodes = {};
  for (const nodeID of nodeIDs) {
    const layer = nodeLayer[nodeID];
    if (!layerNodes[layer]) {
      layerNodes[layer] = [];
    }
    layerNodes[layer].push(nodeID);
  }
  return layerIDs.map((layerID) => layerNodes[layerID]);
}

export const getNodeRank = (node, edges, layer, nodes) => {
  const layerIDs = getVisibleLayerIDs(node, layer);
  let layerNodes = getLayerNodes(node, layer);
  let nodeIDs = node.ids;
  if (!layerIDs.length) {
    return {};
  }
  const nodeDeps = {};
  for (const nodeID of nodeIDs) {
    nodeDeps[nodeID] = [];
  }

  // 去环
  let noLoopEdges = [];
  const dfs = (node) => {
    let targetEdges = node.targets || [];
    let sourceEdges = node.sources || [];
    targetEdges.forEach(item => {
      let targetNode = item.targetNodeObj || {};
      if (!targetNode._flagNode) {
        targetNode._flagNode = 1;
        if (!item._flagedge) {
          item._flagedge = 1;
          noLoopEdges.push(item);
        }
        dfs(targetNode);
      }
    });
    sourceEdges.forEach(item => {
      let sourceNode = item.sourceNodeObj || {};
      if (!sourceNode._flagNode) {
        sourceNode._flagNode = 1;
        if (!item._flagedge) {
          item._flagedge = 1;
          noLoopEdges.push(item);
        }
        dfs(sourceNode);
      }
    });
  }
  const loopEdges = (nodes) => {
    nodes.forEach((item) => {
        if (!item._flagNode) {
          dfs(item);
        }
    });
  }
  loopEdges(nodes);
  nodes.forEach(item => {
    item._flagNode = 0;
  });
  edges.forEach(item => {
    item._flagedge = 0;
  })

  for (const edge of noLoopEdges) {
    let sourceNode = typeof(edge.sourceNode) !== 'undefined' ? edge.sourceNode : edge.source;
    let targetNode = typeof(edge.targetNode) !== 'undefined' ? edge.targetNode : edge.target;
    nodeDeps[sourceNode].push(targetNode);
  }

  // 因为是RL方向所以需要逆向
  for (let i = layerNodes.length - 1; i > 0; i--) {
    for (const sourceID of layerNodes[i]) {
      for (const targetID of layerNodes[i - 1]) {
        nodeDeps[sourceID].push(targetID);
      }
    }
  }

  const toposortedNodes = batchingToposort(nodeDeps);

  const nodeRanks = {};
  for (let rank = 0; rank < toposortedNodes.length; rank++) {
    for (const nodeID of toposortedNodes[rank]) {
      nodeRanks[nodeID] = rank;
    }
  }

  return nodeRanks;
}