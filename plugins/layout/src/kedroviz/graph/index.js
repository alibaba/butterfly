import { graph, addEdgeLinks } from "./graph";
import { getNodes } from "../selectors/nodes";
import normalizeData from "../data/normalize-data";

export const kedrovizLayout = (param) => {
  let { visible = true, rankdir = "TB", spaceDirection, spaceReverseDirection, Class: LayerClass } = param;
  let { edges = [], nodes = [], layers = [] } = param.data;
  let _nodes = nodes;

  let {node, edge, layer} = normalizeData(_nodes, edges, layers, visible);
  let _layers = visible ? layers : [];

  let _rankdir = (rankdir === 'TB' || rankdir === 'BT') ? 'column' : 'row';
  let isRankReverse = (rankdir === 'BT' || rankdir === 'RL') ? true : false;
  
  let _spaceDirection = !spaceDirection ? 40 : spaceDirection; //垂直间距
  let _spaceReverseDirection = !spaceReverseDirection ? 150 : spaceReverseDirection; //水平间距

  const defaultOptions = {
    layout: {
      spaceDirection: _spaceDirection, // 垂直间距
      spaceReverseDirection: _spaceReverseDirection, //水平间距
      layerSpaceReverseDirection: 80,
      spreadDirection: 3, //分散
      padding: 50,
      iterations: 25,
    }
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

