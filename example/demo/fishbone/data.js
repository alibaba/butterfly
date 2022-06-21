'use strict';

const Node = require('./node.js');
const Edge = require('./edge');
const { default: fishboneLayout } = require('../../../src/utils/layout/fishboneLayout.js');
const SelfTree = require('./tusuanfa.js');
const treeData = require('./long_data.json');

const dataTree = SelfTree.layout2(treeData);

const layerCache = [];
for (let cc = 0; cc < 1000; cc++) {
  layerCache.push(1);
}
dataTree.nodes.forEach(n => {
  n.vTimes = layerCache[n.initLayer];
  layerCache[n.initLayer] += 1;
});
let maxValue = 0;
for (let cc of layerCache) {
  if (cc > maxValue) maxValue = cc;
}
console.log(maxValue)

const selfNodes = dataTree.nodes.map(n => {
  const res = {};
  res.draggable = false;
  res.id = n.id;
  res.label = n.label;
  res.top = n.top;
  res.left = n.left;
  // res.left = n.vTimes * ((maxValue - 1) * 120 / layerCache[n.initLayer]);
  // res.left = (n.layerPos + 1) * ((maxValue - 1) * 120 / layerCache[n.initLayer]);
  res.Class = Node;
  res.endpoints = [{
    id: 'down',
    orientation: [0, 1],
    pos: [1.1,1]
  }, {
    id: 'up',
    orientation: [0, -1],
    pos: [1.1, 1]
  }];
  return res;
});
const selfEdges = treeData.edges.map(e => {
  const res = {};
  res.type = 'endpoint';
  res.source = 'up';
  res.target = 'down';
  res.sourceNode = e.source;
  res.targetNode = e.target;
  res.arrow = true;
  return res;
});
module.exports = {
  nodes: selfNodes,
  edges: selfEdges
}
