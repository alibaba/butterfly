'use strict';

const d3 = require('d3-force');
const _ = require('lodash');
const dagre = require('dagre');
import Layout from './circleLayout.js';

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
      return _group.id === item.group;
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
      if (opts.chargeStrength) {
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
function drageLayout(param) {
  const {nodeSize, rankdir, nodesepFunc, ranksepFunc, nodesep, ranksep, controlPoints} = param;
  const {edges = []} = param.data;
  const curnode = param.data.nodes;
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
    g.setNode(node.id, {width, height});
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
    if (coord) {
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

// 同心圆布局
function concentLayout(param) {
  let {
    center,
    nodeSize,
    minNodeSpacing,
    preventOverlap,
    sweep,
    equidistant,
    startAngle = (3 / 2) * Math.PI,
    clockwise,
    maxLevelDiff,
    sortBy,
    width,
    height,
    data,
  } = param;
  const curnode = data.nodes;
  const curedges = data.edges;
  let nodes = curnode.map((item) => {
    return {
      id: item.id,
      top: item.top,
      left: item.left,
      degree: item.degree,
      size: item.size,
    }
  });
  let edges = curedges.map((item) => {
    return {
      source: item.source,
      target: item.target,
    }
  });
  const n = nodes.length;
  let maxValueNode;
  let counterclockwise;
  if (n === 0) {
    return;
  }
  if (n === 1) {
    nodes[0].x = center[0];
    nodes[0].y = center[1];
    return;
  }
  const layoutNodes = [];
  let maxNodeSize;
  if (_.isArray(nodeSize)) {
    maxNodeSize = Math.max(nodeSize[0], nodeSize[1]);
  } else {
    maxNodeSize = nodeSize;
  }
  nodes.forEach(node => {
    layoutNodes.push(node);
    let nodeSize = maxNodeSize;
    if (_.isArray(node.size)) {
      nodeSize = Math.max(node.size[0], node.size[1]);
    } else if (_.isNumber(node.size)) {
      nodeSize = node.size;
    }
    maxNodeSize = Math.max(maxNodeSize, nodeSize);
  });
  if (!width && typeof window !== 'undefined') {
    width = window.innerWidth;
  }
  if (!height && typeof window !== 'undefined') {
    height = window.innerHeight;
  }
  clockwise = counterclockwise !== undefined ? !counterclockwise : clockwise;

  // layout
  const nodeMap = {};
  const nodeIdxMap = {};
  layoutNodes.forEach((node, i) => {
    nodeMap[node.id] = node;
    nodeIdxMap[node.id] = i;
  });

  // get the node degrees
  if (
    sortBy === 'degree' ||
    !_.isString(sortBy) ||
    layoutNodes[0][sortBy] === undefined
  ) {
    sortBy = 'degree';
    if (!_.isNumber(nodes[0].degree)) {
      let values = [];
      const len = nodes.length
      for (let i = 0; i < len; i++) {
        values[i] = 0;
      }
      edges.forEach(e => {
        if (e.source) {
          values[nodeIdxMap[e.source]] += 1;
        }
        if (e.target) {
          values[nodeIdxMap[e.target]] += 1;
        }
      });
      layoutNodes.forEach((node, i) => {
        node.degree = values[i];
      });
    }
  }
  // sort nodes by value
  layoutNodes.sort((n1, n2) => n2[sortBy] - n1[sortBy]);
  maxValueNode = layoutNodes[0];
  maxLevelDiff = maxLevelDiff || maxValueNode[sortBy] / 4;

  // put the values into levels
  const levels = [[]];
  let currentLevel = levels[0];
  layoutNodes.forEach(node => {
    if (currentLevel.length > 0) {
      const diff = Math.abs(currentLevel[0][sortBy] - node[sortBy]);
      if (maxLevelDiff && diff >= maxLevelDiff) {
        currentLevel = [];
        levels.push(currentLevel);
      }
    }
    currentLevel.push(node);
  });

  // create positions for levels
  let minDist = maxNodeSize + minNodeSpacing; // min dist between nodes
  if (!preventOverlap) {
    // then strictly constrain to bb
    const firstLvlHasMulti = levels.length > 0 && levels[0].length > 1;
    const maxR = Math.min(width, height) / 2 - minDist;
    const rStep = maxR / (levels.length + (firstLvlHasMulti ? 1 : 0));

    minDist = Math.min(minDist, rStep);
  }

  // find the metrics for each level
  let r = 0;
  levels.forEach(level => {
    let sweep = sweep;
    if (sweep === undefined) {
      sweep = 2 * Math.PI - (2 * Math.PI) / level.length;
    }
    const dTheta = (level.dTheta = sweep / Math.max(1, level.length - 1));

    // calculate the radius
    if (level.length > 1 && preventOverlap) {
      // but only if more than one node (can't overlap)
      const dcos = Math.cos(dTheta) - Math.cos(0);
      const dsin = Math.sin(dTheta) - Math.sin(0);
      const rMin = Math.sqrt((minDist * minDist) / (dcos * dcos + dsin * dsin)); // s.t. no nodes overlapping

      r = Math.max(rMin, r);
    }
    level.r = r;
    r += minDist;
  });

  if (equidistant) {
    let rDeltaMax = 0;
    let rr = 0;
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      const rDelta = level.r - rr;
      rDeltaMax = Math.max(rDeltaMax, rDelta);
    }
    rr = 0;
    levels.forEach((level, i) => {
      if (i === 0) {
        rr = level.r;
      }
      level.r = rr;
      rr += rDeltaMax;
    });
  }

  // calculate the node positions
  levels.forEach(level => {
    const dTheta = level.dTheta;
    const rr = level.r;
    level.forEach((node, j) => {
      const theta = startAngle + (clockwise ? 1 : -1) * dTheta * j;
      node.x = center[0] + rr * Math.cos(theta);
      node.y = center[1] + rr * Math.sin(theta);
    });
  });

  param.data.nodes.forEach((node, index) => {
    node.top = nodes[index].y;
    node.left = nodes[index].x;
  });
}


export default {
  forceLayout,
  forceTreeLayout,
  treeLayout,
  drageLayout,
  concentLayout,
  circleLayout: Layout.circleLayout
}
