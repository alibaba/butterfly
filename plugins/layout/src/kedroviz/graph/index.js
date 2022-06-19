import { graph } from "./graph";
import { getNodes } from "../selectors/nodes";
import normalizeData from "../data/normalize-data";

export const kedrovizLayout = (param) => {
  let { edges, nodes, layers } = param.data;
  let {node, edge, layer} = normalizeData(nodes, edges, layers);
  let _layers = layers.visible ? layers.layers : [];
  const result = graph(getNodes(nodes, node, layer), edges, _layers);
  param.data.nodes.forEach((item, index) => {
    item.nearestLayer = result.nodes[index].nearestLayer;
    item.rank = result.nodes[index].rank;
    item.top = result.nodes[index].y;
    item.left = result.nodes[index].x;
    item.width = result.nodes[index].width;
    item.height = result.nodes[index].height; 
  });
};

