const dagre = require('dagre');
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

  module.exports = drageLayout