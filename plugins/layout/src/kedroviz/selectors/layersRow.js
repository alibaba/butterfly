import normalizeData from '../data/normalize-data';
import {getVisibleLayerIDs} from './disabled';
import { bounds as size } from './size'

export const getLayers = ({ nodes, edges, layers }) => {
  let { layer, node } = normalizeData(nodes, edges, layers);
  const layerName = layer.name;
  let _size = size(nodes, 100);
  const { width, height } = _size;

  const bounds = {};
  for (const node of nodes) {
    const layer = node.nearestLayer || node.layer;

    if (layer) {
      const bound = bounds[layer] || (bounds[layer] = [Infinity, -Infinity]);

      let nodeX = node.x || node.left;

      if (nodeX - node.width < bound[0]) {
        bound[0] = nodeX - node.width + node.width * 0.5;
      }

      if (nodeX + node.width > bound[1]) {
        bound[1] = nodeX + node.width + node.width * 0.5;
      }
    }
  }
  const layerIDs = getVisibleLayerIDs(node, layer);

  return layerIDs.map((id, i) => {
    const currentBound = bounds[id] || [0, 0];
    const prevBound = bounds[layerIDs[i - 1]] || [
      currentBound[0],
      currentBound[0],
    ];
    const nextBound = bounds[layerIDs[i + 1]] || [
      currentBound[1],
      currentBound[1],
    ];
    const start = (prevBound[1] + currentBound[0]) / 2;
    const end = (currentBound[1] + nextBound[0]) / 2;
    const rectHeight = Math.max(width, height) * 5;

    return {
      id,
      name: layerName[id],
      y: (rectHeight - height) / -2,
      x: start,
      height: rectHeight,
      width: Math.max(end - start, 0),
    };
  });
};
