'use strict';
import { 
  compare,
  distance1d,
  angle,
  nearestOnLine,
  nearestOnLine1,
  groupByRow,
  nodeLeft,
  nodeRight,
  nodeTop,
  nodeBottom
} from './utils.js';

const routing = ({
  nodes,
  edges,
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
  nodes.forEach((node) => {
    node.width = node.options.width;
    node.x = node.left + (node.width * 0.5);
    node.height = node.options.height;
    node.y = node.top + (node.height * 0.5);
    node.nodeLeft = node.x - node.width * 0.5;
    node.nodeRight = node.x + node.width * 0.5;
    node.nodeTop = node.y - node.height * 0.5;
    node.nodeBottom = node.y + node.height * 0.5;
  });

  const rows = groupByRow(nodes, rankdir);
  console.log(rows);

  for (const node of nodes) {
    node.targets.sort((a, b) =>
      compare(
        angle(b.sourceNodeObj, b.targetNodeObj),
        angle(a.sourceNodeObj, a.targetNodeObj)
      )
    );
  }
  for (const edge of edges) {
    const source = edge.sourceNodeObj;
    const target = edge.targetNodeObj;
    source.x = source.left + (source.width * 0.5);
    source.y = source.top + (source.height * 0.5);
    target.x = target.left + (target.width * 0.5);
    target.y = target.top + (target.height * 0.5);
    edge.points = [];



    // if(source.row < target.row) {
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
      if(source.row <= target.row) {
        for (let i = source.row + 1; i < target.row; i += 1) {
          const firstNode = rows[i][0];
          if(rankdir === 'column' && (distance1d(target.y, firstNode.y) <= Math.max(firstNode.height, target.height) || distance1d(source.y, firstNode.y) <= Math.max(firstNode.height, source.height))) {
            continue;
          }
          if(rankdir === 'row' && (distance1d(target.x, firstNode.x) <= Math.max(firstNode.width, target.width) || distance1d(source.x, firstNode.x) <= Math.max(firstNode.width, source.width))) {
            continue;
          }

          let nearestPoint = rankdir === 'column' ? { x: firstNode.nodeLeft - spaceDirection, y: firstNode.y } : { x: firstNode.x , y: firstNode.nodeTop - spaceDirection};
          let nearestDistance = Infinity;

          const rowExtended = rankdir === 'column' ? [
            { ...firstNode, x: Number.MIN_SAFE_INTEGER },
            ...rows[i],
            { ...firstNode, x: Number.MAX_SAFE_INTEGER },
          ] : [
            { ...firstNode, y: Number.MIN_SAFE_INTEGER },
            ...rows[i],
            { ...firstNode, y: Number.MAX_SAFE_INTEGER },
          ];

          for (let i = 0; i < rowExtended.length - 1; i += 1) {
            const node = rowExtended[i];
            const nextNode = rowExtended[i + 1];
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
      } else if (source.row > target.row) {
        for (let i = source.row - 1 ; i > target.row; i -= 1) {
          const firstNode = rows[i][0];
          if(rankdir === 'column' && (distance1d(target.y, firstNode.y) <= Math.max(firstNode.height, target.height) || distance1d(source.y, firstNode.y) <= Math.max(firstNode.height, source.height))) {
            continue;
          }
          if(rankdir === 'row' && (distance1d(target.x, firstNode.x) <= Math.max(firstNode.width, target.width) || distance1d(source.x, firstNode.x) <= Math.max(firstNode.width, source.width))) {
            continue;
          }

          let nearestPoint = rankdir === 'column' ? { x: firstNode.nodeLeft - spaceDirection, y: firstNode.y } : { x: firstNode.x , y: firstNode.nodeTop - spaceDirection};
          let nearestDistance = Infinity;

          const rowExtended = rankdir === 'column' ? [
            { ...firstNode, x: Number.MIN_SAFE_INTEGER },
            ...rows[i],
            { ...firstNode, x: Number.MAX_SAFE_INTEGER },
          ] : [
            { ...firstNode, y: Number.MIN_SAFE_INTEGER },
            ...rows[i],
            { ...firstNode, y: Number.MAX_SAFE_INTEGER },
          ];

          for (let i = 0; i < rowExtended.length - 1; i += 1) {
            const node = rowExtended[i];
            const nextNode = rowExtended[i + 1];
            const nodeGap = rankdir === 'column' ? nextNode.nodeLeft - node.nodeRight : nextNode.nodeTop - node.nodeBottom;

            if (nodeGap < minPassageGap) {
              continue;
            }

            const offsetDirection = Math.min(spaceDirection, nodeGap * 0.5);

            const candidatePoint = rankdir === 'column' ? nearestOnLine1(
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


  for (const node of nodes) {
    node.targets.sort((a, b) =>
      compare(
        angle(b.sourceNodeObj, b.points[0] || b.targetNodeObj),
        angle(a.sourceNodeObj, a.points[0] || a.targetNodeObj)
      )
    );
    node.sources.sort((a, b) =>
      compare(
        angle(a.points[a.points.length - 1] || a.sourceNodeObj, a.targetNodeObj),
        angle(b.points[b.points.length - 1] || b.sourceNodeObj, b.targetNodeObj)
      )
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

    // let pointReverseDirectionMax = rankdir === 'column' ? points[0].y : points[0].x;

    // for (const point of points) {
      
    //   if(rankdir === "column") {
    //     if (point.y < pointReverseDirectionMax) {
    //       point.y = pointReverseDirectionMax;
    //     } else {
    //       pointReverseDirectionMax = point.y;
    //     }
    //   } else {
    //     if (point.x < pointReverseDirectionMax) {
    //       point.x = pointReverseDirectionMax;
    //     } else {
    //       pointReverseDirectionMax = point.x;
    //     }
    //   }     
    // }

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
    edge.sourceNodeObj = nodeById[sourceNode];
    edge.targetNodeObj = nodeById[targetNode];
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
    stemSpaceSource: 6,
    stemSpaceTarget: 10
  };
  addEdgeLinks(nodes, edges);
  routing({nodes, edges, rankdir: _rankdir, ...defaultOptions});
}

export default obstacleAvoidancePoints;
