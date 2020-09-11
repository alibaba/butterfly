'use strict';

const d3 = require('d3-force');
const _ = require('lodash');
const dagre = require('dagre');
import Layout from './circleLayout.js';


function gridLayout (param) {
  const self = param.opts;
  const nodes = param.data.nodes;
  const n = nodes.length;
  const center = self.center;
  if (n === 0) {
    return;
  }
  if (n === 1) {
    nodes[0].x = center[0];
    nodes[0].y = center[1];
    return;
  }

  const edges = param.data.edges;
  const layoutNodes = [];
  nodes.forEach((node) => {
    console.log(node);
    layoutNodes.push(node);
  });
  const nodeIdxMap = {};
  layoutNodes.forEach((node, i) => {
    nodeIdxMap[node.id] = i;
  });

  // 排序
  if (
    self.sortBy === 'degree' ||
    typeof self.sortBy === 'string' ||
    layoutNodes[0][self.sortBy] === undefined
  ) {
    self.sortBy = 'degree';
    if (isNaN(nodes[0].degree)) {
      const values = getDegree(layoutNodes.length, nodeIdxMap, edges);
      layoutNodes.forEach((node, i) => {
        node.degree = values[i];
      });
    }
  }
  // sort nodes by value
  layoutNodes.sort((n1, n2) => (n2)[self.sortBy] - (n1)[self.sortBy]);

  if (!self.width && typeof window !== 'undefined') {
    self.width = window.innerWidth;
  }
  if (!self.height && typeof window !== 'undefined') {
    self.height = window.innerHeight;
  }

  const oRows = self.rows;
  const oCols = self.cols != null ? self.cols : self.columns;
  self.cells = n;

  // if rows or columns were set in self, use those values
  if (oRows != null && oCols != null) {
    self.rows = oRows;
    self.cols = oCols;
  } else if (oRows != null && oCols == null) {
    self.rows = oRows;
    self.cols = Math.ceil(self.cells / self.rows);
  } else if (oRows == null && oCols != null) {
    self.cols = oCols;
    self.rows = Math.ceil(self.cells / self.cols);
  } else {
    // otherwise use the automatic values and adjust accordingly	      // otherwise use the automatic values and adjust accordingly
    // width/height * splits^2 = cells where splits is number of times to split width
    self.splits = Math.sqrt((self.cells * self.height) / self.width);
    self.rows = Math.round(self.splits);
    self.cols = Math.round((self.width / self.height) * self.splits);
  }

  self.cellWidth = self.width / self.cols;
  self.cellHeight = self.height / self.rows;

  if (self.condense) {
    self.cellWidth = 0;
    self.cellHeight = 0;
  }

  if (self.preventOverlap) {
    layoutNodes.forEach((node) => {
      if (!node.x || !node.y) {
        // for bb
        node.x = 0;
        node.y = 0;
      }

      let nodew;
      let nodeh;
      // if (isArray(node.size)) {
      //   nodew = node.size[0];
      //   nodeh = node.size[1];
      // } else 
      if ( typeof node.size === 'number') {
        nodew = node.size;
        nodeh = node.size;
      }
      if (nodew === undefined || nodeh === undefined) {
        // if (isArray(self.nodeSize)) {
        //   nodew = self.nodeSize[0];
        //   nodeh = self.nodeSize[1];
        // } else 
        if ( typeof node.nodeSize === 'number') {
          nodew = self.nodeSize;
          nodeh = self.nodeSize;
        } else {
          nodew = 30;
          nodeh = 30;
        }
      }

      const p = self.preventOverlapPadding;

      const w = nodew + p;
      const h = nodeh + p;

      self.cellWidth = Math.max(self.cellWidth, w);
      self.cellHeight = Math.max(self.cellHeight, h);
    });
  }

  self.cellUsed = {}; // e.g. 'c-0-2' => true

  // to keep track of current cell position
  self.row = 0;
  self.col = 0;

  // get a cache of all the manual positions
  self.id2manPos = {};
  for (let i = 0; i < layoutNodes.length; i++) {
    const node = layoutNodes[i];
    let rcPos;
    if (self.position) {
      rcPos = self.position(node);
    }

    if (rcPos && (rcPos.row !== undefined || rcPos.col !== undefined)) {
      // must have at least row or col def'd
      const pos = {
        row: rcPos.row,
        col: rcPos.col,
      };

      if (pos.col === undefined) {
        // find unused col
        pos.col = 0;

        while (used(pos.row, pos.col,self)) {
          pos.col++;
        }
      } else if (pos.row === undefined) {
        // find unused row
        pos.row = 0;

        while (used(pos.row, pos.col,self)) {
          pos.row++;
        }
      }

      self.id2manPos[node.id] = pos;
      use(pos.row, pos.col);
    }
    getPos(node,self);
  }
  
}

function getDegree (n, nodeIdxMap, edges) {
  const degrees = [];
  for (let i = 0; i < n; i++) {
    degrees[i] = 0;
  }
  edges.forEach((e) => {
    if (e.source) {
      degrees[nodeIdxMap[e.source]] += 1;
    }
    if (e.target) {
      degrees[nodeIdxMap[e.target]] += 1;
    }
  });
  return degrees;
};

function use(row, col,self) {
  self.cellUsed[`c-${row}-${col}`] = true;
}

function used(row, col,self) {
  return self.cellUsed[`c-${row}-${col}`] || false;
}

function moveToNextCell(param) {
  const self = param;
  const cols = self.cols || 5;
  self.col++;
  if (self.col >= cols) {
    self.col = 0;
    self.row++;
  }
}

function getPos(node,param) {
  const self = param;
  const begin = self.begin;
  const cellWidth = self.width;
  const cellHeight = self.height;
  let x;
  let y;

  // see if we have a manual position set
  const rcPos = self.id2manPos[node.id];
  if (rcPos) {
    x = rcPos.col * cellWidth + cellWidth / 2 + begin[0];
    y = rcPos.row * cellHeight + cellHeight / 2 + begin[1];
  } else {
    // otherwise set automatically
    while (used(self.row, self.col,self)) {
      moveToNextCell(param);
    }

    x = self.col * cellWidth + cellWidth / 2 + begin[0];
    y = self.row * cellHeight + cellHeight / 2 + begin[1];
    use(self.row, self.col,self);

    moveToNextCell(param);
  }
  node.x = x;
  node.y = y;
  node.left = x;
  node.top = y
}


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
  gridLayout,
  circleLayout: Layout.circleLayout
}
