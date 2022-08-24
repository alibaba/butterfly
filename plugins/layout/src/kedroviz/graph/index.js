import { graph, addEdgeLinks } from "./graph";
import { getNodes } from "../selectors/nodes";
import normalizeData from "../data/normalize-data";

export const kedrovizLayout = (param) => {
  let { visible = true, rankdir = "TB" } = param;
  let { edges = [], nodes = [], layers = [] } = param.data;
  let _nodes = nodes;

  let {node, edge, layer} = normalizeData(_nodes, edges, layers, visible);
  let _layers = visible ? layers : [];

  let _rankdir = (rankdir === 'TB' || rankdir === 'BT') ? 'column' : 'row';
  let isRankReverse = (rankdir === 'BT' || rankdir === 'RL') ? true : false;
  
  let _spaceDirection = node.maxHeight;
  let _spaceReverseDirection = node.maxWidth;

  const defaultOptions = {
    layout: {
      spaceDirection: 30,
      spaceReverseDirection: _spaceReverseDirection ? _spaceReverseDirection * 0.7 : 110,
      layerSpaceReverseDirection: 55,
      spreadDirection: 2.2,
      padding: 100,
      iterations: 25,
    },
    routing: {
      spaceDirection: 26,
      spaceReverseDirection: 28,
      minPassageGap: 40,
      stemUnit: 8,
      stemMinSource: 5,
      stemMinTarget: 5,
      stemMax: 20,
      stemSpaceSource: 6,
      stemSpaceTarget: 10,
    },
  };

  let nodesData = getNodes(_nodes, node, edges, layer);
  addEdgeLinks(nodesData, edges);

  const result = graph(nodesData, edges, _layers, _rankdir, isRankReverse, defaultOptions);

  param.data.nodes.forEach((item, index) => {
    item.nearestLayer = result.nodes[index].nearestLayer;
    item.rank = result.nodes[index].rank;
    item.top = result.nodes[index].y;
    item.left = result.nodes[index].x;
  });
};

