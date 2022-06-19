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

const getNodeSize = (nodeIDs, nodeName) => {
  let nodeTextWidth = getNodeTextWidth(nodeIDs, nodeName);
  return arrayToObject(nodeIDs, (nodeID) => {
    const padding = { x: 20, y: 10 };
    const textWidth = nodeTextWidth[nodeID];
    const textGap = 6;
    const innerWidth = textWidth + textGap;
    return {
      width: innerWidth + padding.x * 2,
      height: padding.y * 3,
    };
  });
};

export const getNodes = (nodesOrg, node, layer) => {
  const nodeIDs = node.ids;
  const nodeName = node.name;
  const nodeLayer = node.layer;
  const nodeIndex = node.index;
  const nodeRank = getNodeRank(node, layer);
  let nodeSize = getNodeSize(nodeIDs, nodeName);
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
