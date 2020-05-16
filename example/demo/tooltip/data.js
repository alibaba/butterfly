'use stice';

const Node = require('./node.jsx');

let num = 20;

function genNode() {
  let nodes = [];
  for (let i = 0; i < num; i++) {
    nodes.push({
      id: i.toString(),
      index: i.toString(),
      Class: Node,
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
      target: i.toString(),
    });
  }
  // 把自我循环那个东西去掉
  edges.shift();
  console.log(edges);

  return edges;
}

module.exports = {
  nodes: genNode(),
  edges: genEdge(),
};

let nodes = [
  {
    id: '0',
    index: '0',
    Class: Node,
  },
  {
    id: '1',
    index: '1',
    Class: Node,
  },
  {
    id: '2',
    index: '2',
    Class: Node,
  },
  {
    id: '3',
    index: '3',
    Class: Node,
  },
  {
    id: '4',
    index: '4',
    Class: Node,
  },
  {
    id: '5',
    index: '5',
    Class: Node,
  },
];

// module.exports = {
//   nodes,
//   edges
// }
