'use strict';

const _ = require('lodash');

import Canvas from './src/canvas/baseCanvas';
import TreeCanvas from './src/canvas/treeCanvas';
import Edge from './src/edge/baseEdge';
import Endpoint from './src/endpoint/baseEndpoint';
import Group from './src/group/baseGroup';
import Node from './src/node/baseNode';
import TreeNode from './src/node/treeNode';
import Minimap from './src/utils/minimap';
import Tips from './src/utils/toolTip';
import Layout from './src/utils/layout/layout';
import Arrow from './src/utils/arrow';
import './src/index.less';

let Butterfly = {
  Canvas,
  TreeCanvas,
  Edge,
  Endpoint,
  Group,
  Node,
  TreeNode,
  Minimap,
  Tips,
  Layout,
  Arrow
};

window.Butterfly = Butterfly;

module.exports = Butterfly;
