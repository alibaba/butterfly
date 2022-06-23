/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
*/
import { getNodeRank } from "./ranks";
import { arrayToObject } from "../utils";

const getNodeSize = (nodeIDs, nodeWidth, nodeHeight) => {
  return arrayToObject(nodeIDs, (nodeID) => {
    return {
      width: nodeWidth[nodeID] || 250,
      height: nodeHeight[nodeID] || 30,
    };
  });
};

export const getNodes = (nodesOrg, node, edges, layer) => {
  const nodeIDs = node.ids;
  const nodeName = node.name;
  const nodeLayer = node.layer;
  const nodeIndex = node.index;
  const nodeRank = getNodeRank(node, edges, layer);
  const nodeWidth = node.width;
  const nodeHeight = node.height;
  let nodeSize = getNodeSize(nodeIDs, nodeWidth, nodeHeight);
  let nodes = nodesOrg.map((item) => {
    let {id} = item;
    return {
      ...item,
      id,
      name: nodeName[id],
      index: nodeIndex[id],
      layer: nodeLayer[id],
      rank: nodeRank[id],
      ...nodeSize[id],
    };
  });
  return nodes;
};
