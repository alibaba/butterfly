/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
*/
import { getNodeRank } from "./ranks";
import { select } from "d3-selection";
import { arrayToObject } from "../utils";

const getNodeTextWidth = (nodeIDs, nodeName) => {
  const nodeTextWidth = {};
  const svg = select(document.body).append("svg").attr("class", "kedro node");
  svg
    .selectAll("text")
    .data(nodeIDs)
    .enter()
    .append("text")
    .text((nodeID) => nodeName[nodeID])
    .each(function (nodeID) {
      const width = this.getBBox ? this.getBBox().width : 0;
      nodeTextWidth[nodeID] = width;
    });
  svg.remove();
  return nodeTextWidth;
};

const getNodeSize = (nodeIDs, nodeName, nodeWidth, nodeHeight) => {
  let nodeTextWidth = getNodeTextWidth(nodeIDs, nodeName);
  return arrayToObject(nodeIDs, (nodeID) => {
    const padding = { x: 20, y: 10 };
    const textWidth = nodeTextWidth[nodeID];
    const textGap = 6;
    const innerWidth = textWidth + textGap;
    return {
      width: nodeWidth[nodeID] || innerWidth + padding.x * 2,
      height: nodeHeight[nodeID] || padding.y * 3,
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
  let nodeSize = getNodeSize(nodeIDs, nodeName, nodeWidth, nodeHeight);
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
