import Node from './node.js';

let num = 200;

function genNode() {
  let nodes = [];
  for (let i = 0; i < num; i++) {
    nodes.push({
      id: i.toString(),
      index: i.toString(),
      Class: Node
    });
  }
  return nodes;
}

function genEdge() {
  let edges = [];
  let index = 0;
  let count = 0;
  for (let i = 0; i < num; i++, count++) {
    if (count > 2 * index + 1) {
      index++;
      count = 0;
    }
    edges.push({
      // source: index.toString(),
      source: '1',
      target: i.toString()
    });
  }
  // 把自我循环那个东西去掉
  edges.shift();
  return edges;
}

export default {
  nodes: genNode(),
  edges: genEdge()
};
