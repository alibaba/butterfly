'use strict';

const d3 = require('d3-force');
const _ = require('lodash');

// 离散布局
function forceLayout(param) {
  let opts = param.opts;
  let data = _.cloneDeep(param.data);

  // 处理groups的布局,把group当成一个节点
  let nodes = data.nodes.filter((item) => {
    return !item.group;
  });
  let groupNodes = data.nodes.filter((item) => {
    return item.group;
  });

  nodes = nodes.concat(data.groups);

  // 在group内先random布局一下
  groupNodes.forEach((item) => {
    let group = _.find(data.groups, (_group) => {
      return  _group.id === item.group;
    });
    item.x = Math.random() * (group.width || 150);
    item.y = Math.random() * (group.height || 120);
  });

  let edges = data.edges.map((_edge) => {
    let souceNode = _.find(groupNodes, (_node) => {
      return _node.source === _edge.id;
    });
    if (souceNode) {
      _edge.source = souceNode.group;
    }
    let targetNode = _.find(groupNodes, (_node) => {
      return _node.target === _edge.id;
    });
    if (targetNode) {
      _edge.target = souceNode.group;
    }
    return _edge;
  });


  let simulation = d3.forceSimulation(nodes)
    .force('charge', (() => {
      if(opts.chargeStrength) {
        return d3.forceManyBody().strength(opts.chargeStrength);
      } else {
        return d3.forceManyBody();
      }
    })())
    .force('center', d3.forceCenter(opts.width / 2, opts.height / 2))
    .force('link', d3.forceLink(edges).id((node) => {
      return node[_.get(opts.link, 'id', 'id')];
    }).distance(opts.link.distance).strength(opts.link.strength))
    .stop();

  for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    simulation.tick();
  }


  param.data.nodes.forEach((node, index) => {
    node.top = data.nodes[index].y;
    node.left = data.nodes[index].x;
  });


  param.data.groups.forEach((group, index) => {
    group.top = data.groups[index].y;
    group.left = data.groups[index].x;
  });
  // 后续需要考虑group的布局

}

// 离散树形布局
function forceTreeLayout(param) {
  let opts = param.opts;
  let data = _.cloneDeep(param.data);

  var simulation = d3.forceSimulation(data.nodes)
  // d3.forceLink(links).distance(20).strength(1)
    .force('charge', d3.forceManyBody().strength(opts.chargeStrength))
    .force('center', d3.forceCenter(opts.width / 2, opts.height / 2))
    .force('link', d3.forceLink(data.edges).distance(opts.link.distance).strength(opts.link.strength))
    .force('x', d3.forceX())
    .force('y', d3.forceY())
    .stop();


  for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    simulation.tick();
  }

  param.data.nodes.forEach((node, index) => {
    node.top = data.nodes[index].y;
    node.left = data.nodes[index].x;
  });

  // 后续需要考虑group的布局
}

// 后续拓展树形布局
function treeLayout(param) {

}


export default {
  forceLayout,
  forceTreeLayout,
  treeLayout
}
