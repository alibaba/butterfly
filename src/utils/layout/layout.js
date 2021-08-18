'use strict';

/**
 * cc: https://github.com/antvis/G6/tree/master/src/layout
 */

const d3 = require('d3-force');
const _ = require('lodash');
import Layout from './circleLayout.js';
import fruchterman from './fruchterman.js';
import gridLayout from './gridLayout.js'
import forceLayout from './forceLayout.js'
import concentLayout from './concentLayout.js'
import dagreLayout from './dagreLayout.js';
import radial from './radial/radial.js';
import DagreGroupLayout from './dagreGroupLayout.js';
import treeLayout from './hierarchy';


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


export default {
  forceLayout,
  forceTreeLayout,
  treeLayout,
  dagreLayout,
  concentLayout,
  gridLayout,
  fruchterman,
  circleLayout: Layout.circleLayout,
  radial,
  dagreGroupLayout: DagreGroupLayout.dagreGroupLayout
}
