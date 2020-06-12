'use strict';

const d3 = require('d3-force');
const _ = require('lodash');
const dagre = require('dagre');

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

//drage布局
function drageLayout(param){
  const { nodeSize, rankdir, nodesepFunc, ranksepFunc, nodesep, ranksep, controlPoints } = param;
  const {edges=[]} = param.data;
  const curnode =  param.data.nodes;
  const nodes = curnode.map((item) => {
    return {
      id: item.id,
      top: item.top,
      left: item.left
    }
  });
// 形成新数组后布局失效
  if (!nodes) return;
  const g = new dagre.graphlib.Graph();
  let nodeSizeFunc; 
  if (!nodeSize) {
    nodeSizeFunc = (d) => {
      if (d.size) {
        if (_.isArray(d.size)) {
          return d.size;
        }
        return [d.size, d.size];
      }
      return [40, 40];
    };
  } else if (_.isArray(nodeSize)) {
    nodeSizeFunc = () => nodeSize;
  } else {
    nodeSizeFunc = () => [nodeSize, nodeSize];
  }
  let horisep = getFunc(nodesepFunc, nodesep, 50);
  let vertisep = getFunc(ranksepFunc, ranksep, 50);
  if (rankdir === 'LR' || rankdir === 'RL') {
    horisep = getFunc(ranksepFunc, ranksep, 50);
    vertisep = getFunc(nodesepFunc, nodesep, 50);
  }
  nodes.forEach(node => {
    const size = nodeSizeFunc(node);
    const verti = vertisep(node);
    const hori = horisep(node);
    const width = size[0] + 2 * hori;
    const height = size[1] + 2 * verti;
    g.setNode(node.id, { width, height});
  });
  edges.forEach(edge => {
    // dagrejs Wiki https://github.com/dagrejs/dagre/wiki#configuring-the-layout
    g.setEdge(edge.source, edge.target, {
      weight: edge.weight || 1
    });
  });
  g.setDefaultEdgeLabel(() => ({}));
  param.nodes = nodes;
  g.setGraph(param);
  dagre.layout(g);
  let coord;
  // 重新布局时g.nodes()可能为undefined
  g.nodes().forEach((node) => {
    coord = g.node(node);
    if(coord){
      const i = nodes.findIndex(it => it.id === node);
      nodes[i].left = coord.x;
      nodes[i].top = coord.y;
      nodes[i].posInfo = {
        _out: g._out[node],
        _in: g._in[node],
        _preds: g._preds[node],
        _sucs: g._sucs[node]
      }
    }
  });
  g.edges().forEach((edge) => {
    coord = g.edge(edge);
    const i = edges.findIndex(it => it.source === edge.v && it.target === edge.w);
    if (controlPoints && edges[i].type !== 'loop' && edges[i].shape !== 'loop') {
      edges[i].controlPoints = coord.points.slice(1, coord.points.length - 1);
    }
  });
  // 将数据挂载到原有数据上，以触发布局
  nodes.forEach((item, index) => {
    curnode[index].left = item.left;
    curnode[index].top = item.top;
    curnode[index].posInfo = item.posInfo;
  });
}

function getFunc(func, value, defaultValue) {
  let resultFunc;
  if (func) {
    resultFunc = func;
  } else if (_.isNumber(value)) {
    resultFunc = () => value;
  } else {
    resultFunc = () => defaultValue;
  }
  return resultFunc;
}



export default {
  forceLayout,
  forceTreeLayout,
  treeLayout,
  drageLayout
}
