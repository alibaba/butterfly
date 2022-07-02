import { graph } from "./graph";
import { getNodes } from "../selectors/nodes";
import normalizeData from "../data/normalize-data";

export const kedrovizLayout = (param) => {
  let { visible = true, rankdir = "TB" } = param;
  let { edges = [], nodes = [], layers = [] } = param.data;
  let {node, edge, layer} = normalizeData(nodes, edges, layers, visible);
  let _layers = visible ? layers : [];
  let _spaceDirection = node.maxHeight;
  let _spaceReverseDirection = node.maxWidth;

  const defaultOptions = {
    layout: {
      spaceDirection: _spaceDirection !== 0 ? _spaceDirection * 0.4 : 14,
      spaceReverseDirection: _spaceReverseDirection ? _spaceReverseDirection * 0.7 : 150,
      layerSpaceReverseDirection: 55,
      spreadDirection: 2.2,
      padding: 100,
      iterations: 25,
    },
    routing: {
      spaceDirection: 26,
      spaceReverseDirection: 30,
      minPassageGap: 40,
      stemUnit: 8,
      stemMinSource: 5,
      stemMinTarget: 5,
      stemMax: 20,
      stemSpaceSource: 6,
      stemSpaceTarget: 10,
    },
  };
  let _rankdir = (rankdir === 'TB' || rankdir === 'BT') ? 'column' : 'row'
  const result = graph(getNodes(nodes, node, edges, layer), edges, _layers, _rankdir, defaultOptions);

  param.data.nodes.forEach((item, index) => {
    item.nearestLayer = result.nodes[index].nearestLayer;
    item.rank = result.nodes[index].rank;
    item.top = result.nodes[index].y;
    item.left = result.nodes[index].x;
    item.width = result.nodes[index].width;
    item.height = result.nodes[index].height; 
  });
};

