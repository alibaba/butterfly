/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
*/
export const getVisibleLayerIDs = (node, layer) => {
  let nodeLayer = node.layer;
  let nodeIDs = node.ids;
  let layersVisible =layer.visible;
  let layerIDs = layer.ids;
  if (!layersVisible) {
    return [];
  }
  let visibleLayerIDs = {};
  for (const nodeID of nodeIDs) {
    visibleLayerIDs[nodeLayer[nodeID]] = true;
  }
  return layerIDs.filter((layerID) => visibleLayerIDs[layerID]);
}