
let node = {
  ids: [],
  name: {},
  index: {},
  layer: {}
};

let edge = {
  ids: [],
  sources: {},
  targets: {},  
};

let layer = {
  ids: [],
  name: {},
  visible: true,
};

function unique (arr) {
  return Array.from(new Set(arr))
}

const addNode = (nodeItem) => {
  const { id } = nodeItem;
  if (node.name[id]) {
    return;
  }
  node.ids.push(id);
  node.index[id] = nodeItem.index;
  node.name[id] = nodeItem.name;
  node.layer[id] = nodeItem.layer;
  node.Class = nodeItem.Class;
};

const addEdge = ({ source, target, id }) => {
  if (edge.ids.includes(id)) {
    return;
  }
  edge.ids.push(id);
  edge.sources[id] = source;
  edge.targets[id] = target;
};

const addLayer = (layerItem) => {
  layer.ids.push(layerItem);
  layer.name[layerItem] = layerItem;
};

const toggleLayers = () => {
  layer.visible = !layer.visible;
}

const normalizeData = (nodes, edges, layers) => {
  nodes.forEach(item => addNode(item));
  edges.forEach(item => addEdge(item));
  layers.layers.forEach(item => addLayer(item));
  layer.visible = layers.visible;
  node.ids = unique(node.ids);
  edge.ids = unique(edge.ids);
  layer.ids = unique(layer.ids);
  return {node, edge, layer};
}

export {normalizeData as default, toggleLayers};
