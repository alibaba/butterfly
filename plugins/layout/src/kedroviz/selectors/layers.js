/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
*/
import normalizeData from '../data/normalize-data';
import {getVisibleLayerIDs} from './disabled';
import { bounds as size } from './size'

export const getLayers = ({ nodes, edges, layers, direction }) => {
  let { layer, node } = normalizeData(nodes, edges, layers);
  const layerName = layer.name;
  let _size = size(nodes, 100);
  const { width, height } = _size;

  const bounds = {};
  for (const node of nodes) {
    const layer = node.nearestLayer || node.layer;

    if (layer) {
      const bound = bounds[layer] || (bounds[layer] = [Infinity, -Infinity]);
      if(direction === 'column') {
        let nodeY = node.y || node.top;

        if (nodeY - node.height < bound[0]) {
          bound[0] = nodeY - node.height + node.height * 0.5;
        }
  
        if (nodeY + node.height > bound[1]) {
          bound[1] = nodeY + node.height + node.height * 0.5;
        }
      } else {
        let nodeX = node.x || node.left;

        if (nodeX - node.width < bound[0]) {
          bound[0] = nodeX - node.width + node.width * 0.5;
        }

        if (nodeX + node.width > bound[1]) {
          bound[1] = nodeX + node.width + node.width * 0.5;
        }
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
    const rectDirection = Math.max(width, height) * 5;

    return {
      id,
      name: layerName[id],
      x: direction === 'column' ? (rectDirection - width) / -2 : start,
      y: direction === 'column' ? start : (rectDirection - height) / -2,
      width: direction === 'column' ? rectDirection : Math.max(end - start, 0),
      height: direction === 'column' ? Math.max(end - start, 0) : rectDirection,
    };
  });
};
