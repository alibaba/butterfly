/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
* Modifications Copyright 2022 butterfly-dag
*/
'use strict';
import {
  distance1d,
  angle,
  nearestOnLine,
  groupByRow,
} from './utils.js';

const routing = ({
  edge,
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

    const source = edge.sourceNodeObj;
    const target = edge.targetNodeObj;
    edge.points = [];
    const reverseSource = !isRankReverse ? source : target;
    const reverseTarget = !isRankReverse ? target : source;
    const reverseSourceTargets = !isRankReverse ? reverseSource.targets : reverseSource.sources;
    const reverseTargetSources = !isRankReverse ? reverseTarget.sources : reverseTarget.targets;

    const sourceSeparation = rankdir === 'column' ? Math.min(
      (reverseSource.width - stemSpaceSource) / reverseSourceTargets.length,
      stemSpaceSource
    ) : Math.min(
      (reverseSource.height - stemSpaceSource) / reverseSourceTargets.length,
      stemSpaceSource
    );

    const sourceEdgeDistance =
      reverseSourceTargets.indexOf(edge) - (reverseSourceTargets.length - 1) * 0.5;
    const targetEdgeDistance =
      reverseTargetSources.indexOf(edge) - (reverseTargetSources.length - 1) * 0.5;

    const sourceOffsetDirection = sourceSeparation * sourceEdgeDistance;
    const targetOffsetDirection = targetSeparation * targetEdgeDistance;
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
    if(reverseSource.row <= reverseTarget.row) {
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
    } else if (reverseSource.row > reverseTarget.row) {
      for (let i = reverseSource.row - 1 ; i > reverseTarget.row; i -= 1) {
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

    const targetSeparation = rankdir === 'column' ? Math.min(
      (reverseTarget.width - stemSpaceTarget) / reverseTargetSources.length,
      stemSpaceTarget
    ) : Math.min(
      (reverseTarget.height - stemSpaceTarget) / reverseTargetSources.length,
      stemSpaceTarget
    );

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
};


const obstacleAvoidancePoints = (opts) => {
  let {edge = {}} = opts;

  routing({ edge, rankdir: _rankdir, isRankReverse, ...defaultOptions});
  
}

export default obstacleAvoidancePoints;
