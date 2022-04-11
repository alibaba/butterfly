'use strict';

const Node = require('./node.js');
const Edge = require('./edge');
const { default: fishboneLayout } = require('../../../src/utils/layout/fishboneLayout.js');

const data = {
  options: {
    /**
     * @param {number} top
     *  Fishbone offset's distance to top
     */
    top: 300,
    /**
     * @param {number} left
     *  Fishbone offset's distance to left
     */
    left: 600,
    /**
     * @param {string} mdoe
     *  Show mode of Fishbone layout，
     *  now there're 2 mode:coincide(default), space-even.
     *  If not set, value=coincide.
     */
    mode: 'coincide',
    /**
     * @param {string} direction
     *  Fishbone's default direction is right.
     *  If direction is RL, direction change to left. 
     *  If not set, value=LR, direction is left.
     */
    direction: 'RL',
    /**
     * @param {number} mainAxisLength
     *  Fishbone's main axis length.
     *  If not set, the length will depends on 1st level children counts.
     */
    mainAxisLength: 2000,
    /**
     * @param {number} mainAxisNodeDistance
     *  Fishbone's 1st level children node's distance.
     *  If this value is set, first child's distance to main axis arrow
     *      = mainAxisNodeDistance, and other children's distance to previous
     *      child = mainAxisNodeDistance * 2(mode = coincide) ||
     *      mainAxisNodeDistance(mode = space-even).
     *  if not set, value = 300.
     */
    mainAxisNodeDistance: 300,
    /**
     * @param {number} biasAngle
     *  The angle between horizontal axis and bias edges.
     *  If not set, value = Math.PI / 3.
     */
    biasAngle: Math.PI / 3,
    /**
     * @param {number} childCanvasLength
     *  Horizontal child's length in Fishbone.
     *  This value is the length of bias version of node.
     *  eg. If value = 100, biasAngle = Math.PI / 4, the node
     *  takes up 50 * 2^1/2 height, 50 * 2^1/2 width.
     * 
     *  If node's real height > childCanvasLength * sin, the node's
     *  length will extend to proper length.
     * 
     *  If not set, value = 70.
     */
    childCanvasLength: 70,
    /**
     * @param {number} childxIndexRelateToParent
     *  The d-value between a horizontal child which depth is n and
     *  a horizontal child which depth is n-1.
     *  If not set, value = 100.
     */
    childxIndexRelateToParent: 100,
    /**
     * @param {number} childHorizontalEdgeLength
     *  Length of child node to it's root.
     *  If not set, value = 400.
     */
    childHorizontalEdgeLength: 400,
    /**
     * @param {number} biasLineDecreaseLength
     *  Length decreasement of bias edge.
     *  If not set, value = 10.
     */
    biasLineDecreaseLength: 10,
  },
  data: {
    text: 'a',
    children: [
      {
        text: 'a-a',
      }, {
        text: 'a-b',
        children: [
          { text: 'a-b-a' },
          {
            text: 'a-b-b',
            children: [
              {
                text: 'a-b-b-a',
              }
            ]
          },
        ]
      }, {
        text: 'a-c',
        children: [
          {
            text: "a-c-a",
            children: [
              {
                text: "a-c-a-a"
              }, {
                text: "a-c-a-b",
                children: [
                  {
                    text: "a-c-a-b-a"
                  }
                ]
              }, {
                text: "a-c-a-c"
              }
            ],
          },
          {
            text: "a-c-b"
          }
        ]
      }, {
        text: 'a-d',
      }
    ]
  }
};

const { nodes, edges } = fishboneLayout(data);
nodes.map((item) => {
  item.Class = Node;
});
module.exports = {
  nodes: nodes,
  edges: edges
}
