/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
*/
'use strict';
import {
  distance1d,
  angle,
  nearestOnLine,
  groupByRow,
} from './utils.js';

const routing = ({
  _nodes: nodes,
  _edges: edges,
  rankdir,
  spaceDirection,
  spaceReverseDirection,
  minPassageGap,
  stemUnit,
  stemMinSource,
  stemMinTarget,
  stemMax,
  stemSpaceSource,
  stemSpaceTarget,
}) => {
  const rows = groupByRow(nodes, rankdir);


  for (const node of nodes) {
    node.targets.sort((a, b) =>
      angle(b.sourceNodeObj, b.targetNodeObj) - angle(a.sourceNodeObj, a.targetNodeObj)
    );
  }
  for (const edge of edges) {
    const source = edge.sourceNodeObj;
    const target = edge.targetNodeObj;
    edge.points = [];

    const sourceSeparation = rankdir === 'column' ? Math.min(
      (source.width - stemSpaceSource) / source.targets.length,
      stemSpaceSource
    ) : Math.min(
      (source.height - stemSpaceSource) / source.targets.length,
      stemSpaceSource
    );

    const sourceEdgeDistance =
      source.targets.indexOf(edge) - (source.targets.length - 1) * 0.5;

    const sourceOffsetDirection = sourceSeparation * sourceEdgeDistance;
    const startPoint = rankdir === 'column' ? { x: source.x + sourceOffsetDirection, y: source.y } : { x: source.x, y: source.y + sourceOffsetDirection };
    let currentPoint = startPoint;

    const getOffsetReverseDirection = (i) => {
      const firstNode = rows[i][0];
      let _rowExtended = [];
      if(rankdir === 'column') {
        _rowExtended.push({ nodeTop: firstNode.nodeTop, nodeLeft: Number.MIN_SAFE_INTEGER - firstNode.width * 0.5, nodeRight: Number.MIN_SAFE_INTEGER + firstNode.width * 0.5 });
        for(let j=0; j<rows[i].length; j++) {
          _rowExtended.push({
            nodeLeft: rows[i][j].nodeLeft,
            nodeRight: rows[i][j].nodeRight,
            nodeTop: rows[i][j].nodeTop
          });
        }
        _rowExtended.push({ nodeTop: firstNode.nodeTop, nodeLeft: Number.MAX_SAFE_INTEGER - firstNode.width * 0.5, nodeRight: Number.MAX_SAFE_INTEGER + firstNode.width * 0.5 });
      } else {
        _rowExtended.push({ nodeLeft: firstNode.nodeLeft, nodeTop: Number.MIN_SAFE_INTEGER - firstNode.height * 0.5, nodeBottom: Number.MIN_SAFE_INTEGER + firstNode.height * 0.5 });
        for(let j=0; j<rows[i].length; j++) {
          _rowExtended.push({
            nodeLeft: rows[i][j].nodeLeft,
            nodeBottom: rows[i][j].nodeBottom,
            nodeTop: rows[i][j].nodeTop
          });
        }
        _rowExtended.push({ nodeLeft: firstNode.nodeLeft, nodeTop: Number.MAX_SAFE_INTEGER - firstNode.height * 0.5, nodeBottom: Number.MAX_SAFE_INTEGER + firstNode.height * 0.5 });
      }
      

      if(rankdir === 'column' && (distance1d(target.y, firstNode.y) <= Math.max(firstNode.height, target.height) || distance1d(source.y, firstNode.y) <= Math.max(firstNode.height, source.height))) {
        return 0;
      }
      if(rankdir === 'row' && (distance1d(target.x, firstNode.x) <= Math.max(firstNode.width, target.width) || distance1d(source.x, firstNode.x) <= Math.max(firstNode.width, source.width))) {
        return 0;
      }

      let nearestPoint = rankdir === 'column' ? { x: firstNode.nodeLeft - spaceDirection, y: firstNode.y } : { x: firstNode.x , y: firstNode.nodeTop - spaceDirection};
      let nearestDistance = Infinity;

      for (let i = 0; i < _rowExtended.length - 1; i += 1) {
        const node = _rowExtended[i];
        const nextNode = _rowExtended[i + 1];
        const nodeGap = rankdir === 'column' ? nextNode.nodeLeft - node.nodeRight : nextNode.nodeTop - node.nodeBottom;

        if (nodeGap < minPassageGap) {
          continue;
        }

        const offsetDirection = Math.min(spaceDirection, nodeGap * 0.5);

        const candidatePoint = rankdir === 'column' ? nearestOnLine(
          currentPoint.x,
          currentPoint.y,
          node.nodeRight + offsetDirection,
          node.nodeTop - spaceReverseDirection,
          nextNode.nodeLeft - offsetDirection,
          nextNode.nodeTop - spaceReverseDirection
        ) : nearestOnLine(
          currentPoint.x,
          currentPoint.y,
          node.nodeLeft - spaceReverseDirection,
          node.nodeBottom + offsetDirection,
          nextNode.nodeLeft - spaceReverseDirection,
          nextNode.nodeTop - offsetDirection
        );

        const distance = rankdir === 'column' ? distance1d(currentPoint.x, candidatePoint.x) : distance1d(currentPoint.y, candidatePoint.y);

        if (distance > nearestDistance) {
          break;
        }

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPoint = candidatePoint;
        }
      }

      const offsetReverseDirection = rankdir === 'column' ? firstNode.height + spaceReverseDirection : firstNode.width + spaceReverseDirection;
      return {offsetReverseDirection, nearestPoint};
    }
    if(source.row <= target.row) {
      for (let i = source.row + 1; i < target.row; i += 1) {
        const {offsetReverseDirection, nearestPoint} = getOffsetReverseDirection(i);
        if(offsetReverseDirection) {
          if (rankdir === 'column') {
            edge.points.push({
              x: nearestPoint.x + sourceOffsetDirection,
              y: nearestPoint.y,
            });
            edge.points.push({
              x: nearestPoint.x + sourceOffsetDirection,
              y: nearestPoint.y + offsetReverseDirection,
            });
      
            currentPoint = {
              x: nearestPoint.x,
              y: nearestPoint.y + offsetReverseDirection,
            };
          } else {
            edge.points.push({
              x: nearestPoint.x,
              y: nearestPoint.y + sourceOffsetDirection,
            });
            edge.points.push({
              x: nearestPoint.x + offsetReverseDirection,
              y: nearestPoint.y + sourceOffsetDirection,
            });

            currentPoint = {
              x: nearestPoint.x + offsetReverseDirection,
              y: nearestPoint.y,
            };
          }
        }
      }
    } else if (source.row > target.row) {
      for (let i = source.row - 1 ; i > target.row; i -= 1) {
        const {offsetReverseDirection, nearestPoint} = getOffsetReverseDirection(i);
        if(offsetReverseDirection) {
          if (rankdir === 'column') {
            edge.points.push({
              x: nearestPoint.x - sourceOffsetDirection,
              y: nearestPoint.y,
            });
            edge.points.push({
              x: nearestPoint.x - sourceOffsetDirection,
              y: nearestPoint.y - offsetReverseDirection,
            });
      
            currentPoint = {
              x: nearestPoint.x,
              y: nearestPoint.y - offsetReverseDirection,
            };
          } else {
            edge.points.push({
              x: nearestPoint.x,
              y: nearestPoint.y - sourceOffsetDirection,
            });
            edge.points.push({
              x: nearestPoint.x - offsetReverseDirection,
              y: nearestPoint.y - sourceOffsetDirection,
            });

            currentPoint = {
              x: nearestPoint.x - offsetReverseDirection,
              y: nearestPoint.y,
            };
          }
        }
      }
    }
  }


  for (const node of nodes) {
    node.targets.sort((a, b) =>
      angle(b.sourceNodeObj, b.points[0] || b.targetNodeObj) - angle(a.sourceNodeObj, a.points[0] || a.targetNodeObj)
    );
    node.sources.sort((a, b) =>
      angle(a.points[a.points.length - 1] || a.sourceNodeObj, a.targetNodeObj) - angle(b.points[b.points.length - 1] || b.sourceNodeObj, b.targetNodeObj)
    );
  }

  for (const edge of edges) {
    const source = edge.sourceNodeObj;
    const target = edge.targetNodeObj;

    const sourceSeparation = rankdir === 'column' ? Math.min(
      (source.width - stemSpaceSource) / source.targets.length,
      stemSpaceSource
    ) : Math.min(
      (source.height - stemSpaceSource) / source.targets.length,
      stemSpaceSource
    );

    const targetSeparation = rankdir === 'column' ? Math.min(
      (target.width - stemSpaceTarget) / target.sources.length,
      stemSpaceTarget
    ) : Math.min(
      (target.height - stemSpaceTarget) / target.sources.length,
      stemSpaceTarget
    );

    const sourceEdgeDistance =
      source.targets.indexOf(edge) - (source.targets.length - 1) * 0.5;
    const targetEdgeDistance =
      target.sources.indexOf(edge) - (target.sources.length - 1) * 0.5;

    const sourceOffsetDirection = sourceSeparation * sourceEdgeDistance;
    const targetOffsetDirection = targetSeparation * targetEdgeDistance;

    const sourceOffsetReverseDirection =
      stemUnit *
      source.targets.length *
      (1 - Math.abs(sourceEdgeDistance) / source.targets.length);

    const targetOffsetReverseDirection =
      stemUnit *
      target.sources.length *
      (1 - Math.abs(targetEdgeDistance) / target.sources.length);

    const sourceStem = rankdir === 'column' ? [
      {
        x: source.x + sourceOffsetDirection,
        y: source.nodeBottom,
      },
      {
        x: source.x + sourceOffsetDirection,
        y: source.nodeBottom + stemMinSource,
      },
      {
        x: source.x + sourceOffsetDirection,
        y:
          source.nodeBottom + stemMinSource + Math.min(sourceOffsetReverseDirection, stemMax),
      },
    ] : [
      {
        x: source.nodeRight,
        y: source.y + sourceOffsetDirection,
      },
      {
        x: source.nodeRight + stemMinSource,
        y: source.y + sourceOffsetDirection,
      },
      {
        x:
          source.nodeRight + stemMinSource + Math.min(sourceOffsetReverseDirection, stemMax),
        y: source.y + sourceOffsetDirection,
      },
    ];

    const targetStem = rankdir === 'column' ? [
      {
        x: target.x + targetOffsetDirection,
        y: target.nodeTop - stemMinTarget - Math.min(targetOffsetReverseDirection, stemMax),
      },
      {
        x: target.x + targetOffsetDirection,
        y: target.nodeTop - stemMinTarget,
      },
      {
        x: target.x + targetOffsetDirection,
        y: target.nodeTop,
      },
    ] : [
      {
        x: target.nodeLeft - stemMinTarget - Math.min(targetOffsetReverseDirection, stemMax),
        y: target.y + targetOffsetDirection,
      },
      {
        x: target.nodeLeft - stemMinTarget,
        y: target.y + targetOffsetDirection,
      },
      {
        x: target.nodeLeft,
        y: target.y + targetOffsetDirection,
      },   
    ];

    const points = [...sourceStem, ...edge.points, ...targetStem];

    edge.points = points;
  }
};

const addEdgeLinks = (nodes, edges) => {
  const nodeById = {};

  for (const node of nodes) {
    nodeById[node.id] = node;
    node.targets = [];
    node.sources = [];
  }

  for (const edge of edges) {
    edge.sourceNodeObj = nodeById[edge.sourceNode];
    edge.targetNodeObj = nodeById[edge.targetNode];
    edge.sourceNodeObj.targets.push(edge);
    edge.targetNodeObj.sources.push(edge);
  }
};


const obstacleAvoidancePoints = (opts) => {
  let {nodes = [], edges = [], layout = {}} = opts;
  let rankdir = layout.options && layout.options.rankdir || 'TB';
  let _rankdir = rankdir === 'TB' || rankdir === 'BT' ? 'column' : 'row';
  const defaultOptions = {
    spaceDirection: 26,
    spaceReverseDirection: 30,
    minPassageGap: 40,
    stemUnit: 8,
    stemMinSource: 5,
    stemMinTarget: 5,
    stemMax: 20,
    stemSpaceSource: 5,
    stemSpaceTarget: 10
  };
  let _nodes = nodes.map(node => {
    let x = node.left + (node.options.width * 0.5);
    let y = node.top + (node.options.height * 0.5);
    return {
      id: node.id,
      width: node.options.width,
      x: x,
      height: node.options.height,
      y: y,
      nodeLeft: x - node.options.width * 0.5,
      nodeRight: x + node.options.width * 0.5,
      nodeTop: y - node.options.height * 0.5,
      nodeBottom: y + node.options.height * 0.5
    }
  });
  let _edges = edges.map(edge => {
    let sourceNode;
    let targetNode;
    if(edge.sourceNode) {
      if(Object.prototype.toString.call(edge.sourceNode) === '[object Object]'){
        sourceNode = edge.sourceNode.id;
      } else {
        sourceNode = edge.sourceNode;
      }
    } else {
      sourceNode = edge.source;
    }
    if(edge.targetNode) {
      if(Object.prototype.toString.call(edge.targetNode) === '[object Object]'){
        targetNode = edge.targetNode.id;
      } else {
        targetNode = edge.targetNode;
      }
    } else {
      targetNode = edge.target;
    }
    return {
      sourceNode,
      targetNode,
    }
  })
  addEdgeLinks(_nodes, _edges);
  routing({_nodes, _edges, rankdir: _rankdir, ...defaultOptions});
  edges.forEach((item, index) => {
    item.points = _edges[index].points;
  });
}

export default obstacleAvoidancePoints;
