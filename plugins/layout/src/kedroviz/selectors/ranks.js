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

export const getNodeRank = (node, edges, layer) => {
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
  let loopEdges = [];
  for (let edge of edges) {
    let sourceNode = edge.sourceNode || edge.source;
    let targetNode = edge.targetNode || edge.target;
    for (let _edge of edges) {
      let _sourceNode = _edge.sourceNode || _edge.source;
      let _targetNode = _edge.targetNode || _edge.target;
      if (sourceNode === _targetNode && targetNode === _sourceNode) {
        loopEdges.push(_edge.id);
      }
    }
  }
  let _edges = [];
  for (let edge of edges) {
    if (!loopEdges.includes(edge.id)) {
      _edges.push(edge);
    }
  }
  console.log('loopEdges--->',loopEdges, _edges,layerNodes);

  for (const edge of _edges) {
    let sourceNode = edge.sourceNode || edge.source;
    let targetNode = edge.targetNode || edge.target;
    nodeDeps[sourceNode].push(targetNode);
  }

  // for (let i = 1; i < layerNodes.length; i++) {
  //   for (const sourceID of layerNodes[i - 1]) {
  //     for (const targetID of layerNodes[i]) {
  //       nodeDeps[sourceID].push(targetID);
  //     }
  //   }
  // }

  const toposortedNodes = batchingToposort(nodeDeps);

  const nodeRanks = {};
  for (let rank = 0; rank < toposortedNodes.length; rank++) {
    for (const nodeID of toposortedNodes[rank]) {
      nodeRanks[nodeID] = rank;
    }
  }
  console.log('nodeDeps---->', nodeDeps,layerNodes, toposortedNodes,nodeRanks);

  return nodeRanks;
}