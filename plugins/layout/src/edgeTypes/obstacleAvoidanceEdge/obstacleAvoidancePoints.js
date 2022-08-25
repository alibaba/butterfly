/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
* Modifications Copyright 2022 butterfly-dag
*/
'use strict';
import { curveBasis, line } from 'd3-shape';
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
  isRankReverse,
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
  let _stemMinSource = stemMinSource;
  let _stemMinTarget = stemMinTarget;
  let _stemSpaceSource = stemSpaceSource;
  let _stemSpaceTarget = stemSpaceTarget;
  if (isRankReverse) {
    stemMinSource = _stemMinTarget;
    stemMinTarget = _stemMinSource;
    stemSpaceSource = _stemSpaceTarget;
    stemSpaceTarget = _stemSpaceSource;
  }

  for (const node of nodes) {
    node.targets.sort((a, b) =>
      angle(b.sourceNodeObj, b.targetNodeObj) - angle(a.sourceNodeObj, a.targetNodeObj)
    );
  }
  for (const edge of edges) {
    const source = edge.sourceNodeObj;
    const target = edge.targetNodeObj;
    let _source = source;
    let _target = target;

    edge.points = [];
    let reverseSource = !isRankReverse ? _source : _target;
    let reverseTarget = !isRankReverse ? _target : _source;
    let reverseSourceTargets = !isRankReverse ? reverseSource.targets : reverseSource.sources;
    let reverseTargetSources = !isRankReverse ? reverseTarget.sources : reverseTarget.targets;

    if(reverseSource.row > reverseTarget.row) {
      reverseSource = reverseTarget;
      reverseTarget = reverseSource;
      reverseSourceTargets = reverseTargetSources;
    }


    const sourceSeparation = rankdir === 'column' ? Math.min(
      (reverseSource.width - stemSpaceSource) / reverseSourceTargets.length,
      stemSpaceSource
    ) : Math.min(
      (reverseSource.height - stemSpaceSource) / reverseSourceTargets.length,
      stemSpaceSource
    );

    // 0.5 -> 0.7
    const sourceEdgeDistance =
      reverseSourceTargets.indexOf(edge) - (reverseSourceTargets.length - 1) * 0.7;

    const sourceOffsetDirection = sourceSeparation * sourceEdgeDistance;
    const startPoint = rankdir === 'column' ? { x: reverseSource.x + sourceOffsetDirection, y: reverseSource.y } : { x: reverseSource.x, y: reverseSource.y + sourceOffsetDirection };
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
        _rowExtended.push({ nodeLeft: firstNode.nodeLeft, nodeTop: Number.MIN_SAFE_INTEGER, nodeBottom: Number.MIN_SAFE_INTEGER});
        for(let j=0; j<rows[i].length; j++) {
          _rowExtended.push({
            nodeLeft: rows[i][j].nodeLeft,
            nodeBottom: rows[i][j].nodeBottom,
            nodeTop: rows[i][j].nodeTop
          });
        }
        _rowExtended.push({ nodeLeft: firstNode.nodeLeft, nodeTop: Number.MAX_SAFE_INTEGER, nodeBottom: Number.MAX_SAFE_INTEGER });
      }
      

      if(rankdir === 'column' && (distance1d(reverseTarget.y, firstNode.y) <= Math.max(firstNode.height, reverseTarget.height) || distance1d(reverseSource.y, firstNode.y) <= Math.max(firstNode.height, reverseSource.height))) {
        return 0;
      }
      if(rankdir === 'row' && (distance1d(reverseTarget.x, firstNode.x) <= Math.max(firstNode.width, reverseTarget.width) || distance1d(reverseSource.x, firstNode.x) <= Math.max(firstNode.width, reverseSource.width))) {
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

          const offsetDirection = Math.min(spaceDirection, nodeGap * 0.8);


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
            node.nodeLeft + spaceReverseDirection,
            node.nodeBottom + offsetDirection,
            nextNode.nodeLeft + spaceReverseDirection,
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
    // if(reverseSource.row <= reverseTarget.row) {
      for (let i = reverseSource.row + 1; i < reverseTarget.row; i += 1) {
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
    // } else if (reverseSource.row > reverseTarget.row) {
    //   for (let i = reverseSource.row - 1 ; i > reverseTarget.row; i -= 1) {
    //     const {offsetReverseDirection, nearestPoint} = getOffsetReverseDirection(i);
    //     if(offsetReverseDirection) {
    //       if (rankdir === 'column') {
    //         edge.points.push({
    //           x: nearestPoint.x - sourceOffsetDirection,
    //           y: nearestPoint.y,
    //         });
    //         edge.points.push({
    //           x: nearestPoint.x - sourceOffsetDirection,
    //           y: nearestPoint.y - offsetReverseDirection,
    //         });
      
    //         currentPoint = {
    //           x: nearestPoint.x,
    //           y: nearestPoint.y - offsetReverseDirection,
    //         };
    //       } else {
    //         edge.points.push({
    //           x: nearestPoint.x,
    //           y: nearestPoint.y - sourceOffsetDirection,
    //         });
    //         edge.points.push({
    //           x: nearestPoint.x - offsetReverseDirection,
    //           y: nearestPoint.y - sourceOffsetDirection,
    //         });

    //         currentPoint = {
    //           x: nearestPoint.x - offsetReverseDirection,
    //           y: nearestPoint.y,
    //         };
    //       }
    //     }
    //   }
    // }
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
    let _source = source;
    let _target = target;
    // if (source.x < target.x) {
    //   _source = target;
    //   _target = source;
    // }

    let reverseSource = !isRankReverse ? _source : _target;
    let reverseTarget = !isRankReverse ? _target : _source;
    let reverseSourceTargets = !isRankReverse ? reverseSource.targets : reverseSource.sources;
    let reverseTargetSources = !isRankReverse ? reverseTarget.sources : reverseTarget.targets;
    // if (source.x < target.x) {
    //   reverseSourceTargets = !isRankReverse ? reverseSource.sources : reverseSource.targets;
    //   reverseTargetSources = !isRankReverse ? reverseTarget.targets : reverseTarget.sources;
    // }

    if(reverseSource.row > reverseTarget.row) {
      reverseSource = reverseTarget;
      reverseTarget = reverseSource;
      reverseSourceTargets = reverseTargetSources;
      reverseTargetSources = reverseSourceTargets;
    }

    const sourceSeparation = rankdir === 'column' ? Math.min(
      (reverseSource.width - stemSpaceSource) / reverseSourceTargets.length,
      stemSpaceSource
    ) : Math.min(
      (reverseSource.height - stemSpaceSource) / reverseSourceTargets.length,
      stemSpaceSource
    );

    const targetSeparation = rankdir === 'column' ? Math.min(
      (reverseTarget.width - stemSpaceTarget) / reverseTargetSources.length,
      stemSpaceTarget
    ) : Math.min(
      (reverseTarget.height - stemSpaceTarget) / reverseTargetSources.length,
      stemSpaceTarget
    );

    // 0.5 -> 0.7
    const sourceEdgeDistance =
      reverseSourceTargets.indexOf(edge) - (reverseSourceTargets.length - 1) * 0.7;
    const targetEdgeDistance =
      reverseTargetSources.indexOf(edge) - (reverseTargetSources.length - 1) * 0.7;

    const sourceOffsetDirection = sourceSeparation * sourceEdgeDistance;
    const targetOffsetDirection = targetSeparation * targetEdgeDistance;

    const sourceOffsetReverseDirection =
      stemUnit *
      reverseSourceTargets.length *
      (1 - Math.abs(sourceEdgeDistance) / reverseSourceTargets.length);

    const targetOffsetReverseDirection =
      stemUnit *
      reverseTargetSources.length *
      (1 - Math.abs(targetEdgeDistance) / reverseTargetSources.length);

    const sourceStem = rankdir === 'column' ? [
      {
        x: reverseSource.x + sourceOffsetDirection,
        y: reverseSource.nodeBottom,
      },
      {
        x: reverseSource.x + sourceOffsetDirection,
        y: reverseSource.nodeBottom + stemMinSource,
      },
      {
        x: reverseSource.x + sourceOffsetDirection,
        y:
        reverseSource.nodeBottom + stemMinSource + Math.min(sourceOffsetReverseDirection, stemMax),
      },
    ] : [
      {
        x: reverseSource.nodeRight,
        y: reverseSource.y + sourceOffsetDirection,
      },
      {
        x: reverseSource.nodeRight + stemMinSource,
        y: reverseSource.y + sourceOffsetDirection,
      },
      {
        x:
        reverseSource.nodeRight + stemMinSource + Math.min(sourceOffsetReverseDirection, stemMax),
        y: reverseSource.y + sourceOffsetDirection,
      },
    ];

    const targetStem = rankdir === 'column' ? [
      {
        x: reverseTarget.x + targetOffsetDirection,
        y: reverseTarget.nodeTop - stemMinTarget - Math.min(targetOffsetReverseDirection, stemMax),
      },
      {
        x: reverseTarget.x + targetOffsetDirection,
        y: reverseTarget.nodeTop - stemMinTarget,
      },
      {
        x: reverseTarget.x + targetOffsetDirection,
        y: reverseTarget.nodeTop,
      },
    ] : [
      {
        x: reverseTarget.nodeLeft - stemMinTarget - Math.min(targetOffsetReverseDirection, stemMax),
        y: reverseTarget.y + targetOffsetDirection,
      },
      {
        x: reverseTarget.nodeLeft - stemMinTarget,
        y: reverseTarget.y + targetOffsetDirection,
      },
      {
        x: reverseTarget.nodeLeft,
        y: reverseTarget.y + targetOffsetDirection,
      },   
    ];

    const points = [...sourceStem, ...edge.points, ...targetStem];

    edge.points = points;
  }
};

const addEdgeLinks = (nodes, edges) => {
  const nodeById = {};

  for (const node of nodes) {
    // if (node.fields) {
    //   node.fields.forEach(item => {
    //     item.targets = [];
    //     item.sources = [];
    //     nodeById[item.id] = item;
    //   });
    // }
    nodeById[node.id] = node;
    node.targets = [];
    node.sources = [];
  }

  for (const edge of edges) {
    let sourceNode = typeof(edge.sourceNode) !== 'undefined' ? edge.sourceNode : edge.source;
    let targetNode = typeof(edge.targetNode) !== 'undefined' ? edge.targetNode : edge.target;
    let _sourceNode = nodeById[parseInt(sourceNode)];
    let _targetNode = nodeById[parseInt(targetNode)];

    // RL且箭头方向逆向
    // let _isReverse = false;
    // if (_sourceNode.nodeLeft < _targetNode.nodeLeft) {
    //   _sourceNode = nodeById[parseInt(targetNode)];
    //   _targetNode = nodeById[parseInt(sourceNode)];
    //   _isReverse = true;
    // }
    edge.sourceNodeObj = _sourceNode;
    edge.targetNodeObj = _targetNode;
    // if (edge.isColEdge && edge.sourceNodeObj.endpoints && edge.targetNodeObj.endpoints) {
      // let _sourceEndPoint = edge._sourceEndPoint;
      // let _targetEndPoint = parseInt(edge._targetEndPoint.replace(/[^\d]/g, " "));
      // let _targetEndPoint = edge._targetEndPoint;
      // edge.sourceNodeObj.endpoints.forEach(endpoint => {
      //   if (_sourceEndPoint === endpoint.id) {
      //     edge.sourceNodeObj.nodeLeft = endpoint._posLeft;
      //     edge.sourceNodeObj.nodeTop = endpoint._posTop;
      //   }
      // });
      // edge.targetNodeObj.endpoints.forEach(endpoint => {
      //   if (_targetEndPoint === endpoint.id) {
      //     edge.targetNodeObj.nodeRight = endpoint._posLeft;
      //     edge.targetNodeObj.nodeTop = endpoint._posTop;
      //   }
      // });
    // }
    // if (!_isReverse) {
      edge.sourceNodeObj.targets.push(edge);
      edge.targetNodeObj.sources.push(edge);
    // } else {
    //   edge.sourceNodeObj.sources.push(edge);
    //   edge.targetNodeObj.targets.push(edge);
    // }
    
  }
};

const toSinglePoint = (value) => {return parseFloat(value).toFixed(1);}

const limitPrecision = (path) => { return path.replace(/\d+\.\d+/g, toSinglePoint)};

const lineShape = line().x((d) => d.x).y((d) => d.y).curve(curveBasis);


const obstacleAvoidancePoints = (opts) => {
  let {nodes = [], edges = [], layout = {}} = opts;

  // nodes.forEach(item => {
  //   if (!item.options) {
  //     item.options = item;
  //   }
  // });
  let rankdir = layout.options && layout.options.rankdir || 'TB';
  let _rankdir = rankdir === 'TB' || rankdir === 'BT' ? 'column' : 'row';
  let isRankReverse = (rankdir === 'BT' || rankdir === 'RL') ? true : false;;
  const defaultOptions = {
    spaceDirection: 50,
    spaceReverseDirection: 30,
    minPassageGap: 40,
    stemUnit: 8,
    stemMinSource: 5,
    stemMinTarget: 5,
    stemMax: 20,
    stemSpaceSource: 6,
    stemSpaceTarget: 10
  };
  // let _nodes = nodes.map(node => {
  //   let x = node.left + (node.options.width * 0.5);
  //   let y = node.top + (node.options.height * 0.5);
  //   let _nodeLeft = x - node.options.width * 0.5;
  //   let _nodeRight = x + node.options.width * 0.5;
  //   let _nodeTop = y - node.options.height * 0.5;
  //   let _nodeBottom = y + node.options.height * 0.5;
  //   return {
  //     id: node.id,
  //     width: node.options.width,
  //     x: x - (node.options.width * 0.5),
  //     height: node.options.height,
  //     y: y - (node.options.width * 0.5),
  //     nodeLeft: _nodeLeft,
  //     nodeRight: _nodeRight,
  //     nodeTop: _nodeTop,
  //     nodeBottom: _nodeBottom,
  //     endpoints: node.endpoints
  //   }
  // });
  let _nodes = nodes.map(node => {
    let x = node.left + (node.width * 0.5);
    let y = node.top + (node.height * 0.5);
    let _nodeLeft = x - node.width * 0.5;
    let _nodeRight = x + node.width * 0.5;
    let _nodeTop = y - node.height * 0.5;
    let _nodeBottom = y + node.height * 0.5;
    return {
      id: node.id,
      width: node.width,
      x: x - (node.width * 0.5),
      height: node.height,
      y: y - (node.height * 0.5),
      nodeLeft: _nodeLeft,
      nodeRight: _nodeRight,
      nodeTop: _nodeTop,
      nodeBottom: _nodeBottom,
      endpoints: node.endpoints
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
      id: edge.id,
      sourceNode,
      targetNode,
      _sourceEndPoint: edge._sourceEndPoint,
      _targetEndPoint: edge._targetEndPoint,
      isColEdge: edge.isColEdge,
    }
  })
  addEdgeLinks(_nodes, _edges);
  routing({_nodes, _edges, rankdir: _rankdir, isRankReverse, ...defaultOptions});
  edges.forEach((item, index) => {
    let _points = _edges[index].points;
    let sourceXEndpoint = item.sourceEndpoint && item.sourceEndpoint._posLeft;
    let sourceYEndpoint = item.sourceEndpoint && item.sourceEndpoint._posTop;
    let targetXEndpoint = item.targetEndpoint && item.targetEndpoint._posLeft;
    let targetYEndpoint = item.targetEndpoint && item.targetEndpoint._posTop;
    let sourceXDistant = 0;
    let sourceYDistant = 0;
    let targetXDistant = 0;
    let targetYDistant = 0;
    
    if (sourceXEndpoint && sourceYEndpoint && targetXEndpoint && targetYEndpoint) {
      targetXDistant = targetXEndpoint - _points[0].x;
      targetYDistant = targetYEndpoint - _points[0].y;
      sourceXDistant = sourceXEndpoint - _points[_points.length-1].x;
      sourceYDistant = sourceYEndpoint - _points[_points.length-1].y;
    }
    _points.forEach((item, index) => {
      if (index < _points.length / 2) {
        item.x = item.x + targetXDistant;
        item.y = item.y + targetYDistant;
      } else {
        item.x = item.x + sourceXDistant;
        item.y = item.y + sourceYDistant;
      }
    });
    let reversePoints = _points.reverse();
    item.points = reversePoints;
  });
  edges.forEach((item) => {
    let _points = item.points;
    let path = _points && limitPrecision(lineShape(_points));
    let resD = '';
    // 为了兼容graphviz
    let pathArr = path.split(/[L ]/);
    let lPath = pathArr[1].substring(0, pathArr[1].indexOf('C'));
    let cPath = pathArr[1].substring(pathArr[1].indexOf('C'));

    let cPathArr = cPath.replace(/([C,])/g,' ').split(' ');
    let resCPath = '';
    for (let cc = 1; cc < cPathArr.length; cc++) {
      resCPath += `${cc % 2 === 0 ? ',' : ' '}${cPathArr[cc]}`;
    }
    resD = `${pathArr[0]}L${lPath}C${resCPath.substring(1)}L${pathArr[2]}`;
    if (_points.length === 6) {
      resD = `M${_points[0].x},${_points[0].y}L${_points[5].x},${_points[5].y}`
    }
    item.d = resD;
  });
}

export default obstacleAvoidancePoints;
