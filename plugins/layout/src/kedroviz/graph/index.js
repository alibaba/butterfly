import { graph } from "./graphRow";
import { getNodes } from "../selectors/nodes";
import normalizeData from "../data/normalize-data";

export const kedrovizLayout = (param) => {
  let { edges, nodes, layers } = param.data;
  let {node, edge, layer} = normalizeData(nodes, edges, layers);
  let _layers = layers.visible ? layers.layers : [];
  const defaultOptions = {
    layout: {
      spaceY: node.maxHeight !== 0 ? node.maxHeight * 0.4 : 14,
      spaceX: node.maxWidth !== 0 ? node.maxWidth * 0.7 : 150,
      layerSpaceX: 55,
      spreadY: 2.2,
      padding: 100,
      iterations: 25,
    },
    routing: {
      spaceY: 26,
      spaceX: 30,
      minPassageGap: 40,
      stemUnit: 8,
      stemMinSource: 5,
      stemMinTarget: 5,
      stemMax: 20,
      stemSpaceSource: 6,
      stemSpaceTarget: 10,
    },
  };

  const defaultOptions = {
    layout: {
      spaceX: 14,
      spaceY: 110,
      layerSpaceY: 55,
      spreadX: 2.2,
      padding: 100,
      iterations: 25,
    },
    routing: {
      spaceX: 26,
      spaceY: 28,
      minPassageGap: 40,
      stemUnit: 8,
      stemMinSource: 5,
      stemMinTarget: 5,
      stemMax: 20,
      stemSpaceSource: 6,
      stemSpaceTarget: 10,
    },
  };
  const result = graph(getNodes(nodes, node, layer), edges, _layers, defaultOptions);
  console.log("result",result);
  param.data.nodes.forEach((item, index) => {
    item.nearestLayer = result.nodes[index].nearestLayer;
    item.rank = result.nodes[index].rank;
    item.top = result.nodes[index].y;
    item.left = result.nodes[index].x;
    item.width = result.nodes[index].width;
    item.height = result.nodes[index].height; 
  });
};

