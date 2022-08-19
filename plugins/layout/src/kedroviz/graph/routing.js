import {
  compare,
  distance1d,
  angle,
  nearestOnLine,
  groupByRow,
  nodeLeft,
  nodeRight,
  nodeTop,
  nodeBottom,
} from './common';

export const routing = ({
  nodes,
  edges,
  spaceX,
  spaceY,
  minPassageGap,
  stemUnit,
  stemMinSource,
  stemMinTarget,
  stemMax,
  stemSpaceSource,
  stemSpaceTarget,
}) => {
  const rows = groupByRow(nodes);

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

    edge.points = [];
    const sourceSeparation = Math.min(
      (source.width - stemSpaceSource) / source.targets.length,
      stemSpaceSource
    );

    const sourceEdgeDistance =
      source.targets.indexOf(edge) - (source.targets.length - 1) * 0.5;

    const sourceOffsetX = sourceSeparation * sourceEdgeDistance;

    const startPoint = { x: source.x + sourceOffsetX, y: source.y };
    let currentPoint = startPoint;

    for (let i = source.row + 1; i < target.row; i += 1) {
      const firstNode = rows[i][0];

      let nearestPoint = { x: nodeLeft(firstNode) - spaceX, y: firstNode.y };
      let nearestDistance = Infinity;

      const rowExtended = [
        { ...firstNode, x: Number.MIN_SAFE_INTEGER },
        ...rows[i],
        { ...firstNode, x: Number.MAX_SAFE_INTEGER },
      ];

      for (let i = 0; i < rowExtended.length - 1; i += 1) {
        const node = rowExtended[i];
        const nextNode = rowExtended[i + 1];
        const nodeGap = nodeLeft(nextNode) - nodeRight(node);

        if (nodeGap < minPassageGap) {
          continue;
        }

        const offsetX = Math.min(spaceX, nodeGap * 0.5);

        const candidatePoint = nearestOnLine(
          currentPoint.x,
          currentPoint.y,
          nodeRight(node) + offsetX,
          nodeTop(node) - spaceY,
          nodeLeft(nextNode) - offsetX,
          nodeTop(nextNode) - spaceY
        );

        const distance = distance1d(currentPoint.x, candidatePoint.x);

        if (distance > nearestDistance) {
          break;
        }

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPoint = candidatePoint;
        }
      }

      const offsetY = firstNode.height + spaceY;
      edge.points.push({
        x: nearestPoint.x + sourceOffsetX,
        y: nearestPoint.y,
      });
      edge.points.push({
        x: nearestPoint.x + sourceOffsetX,
        y: nearestPoint.y + offsetY,
      });

      currentPoint = {
        x: nearestPoint.x,
        y: nearestPoint.y + offsetY,
      };
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

    const sourceSeparation = Math.min(
      (source.width - stemSpaceSource) / source.targets.length,
      stemSpaceSource
    );

    const targetSeparation = Math.min(
      (target.width - stemSpaceTarget) / target.sources.length,
      stemSpaceTarget
    );

    const sourceEdgeDistance =
      source.targets.indexOf(edge) - (source.targets.length - 1) * 0.5;
    const targetEdgeDistance =
      target.sources.indexOf(edge) - (target.sources.length - 1) * 0.5;

    const sourceOffsetX = sourceSeparation * sourceEdgeDistance;
    const targetOffsetX = targetSeparation * targetEdgeDistance;

    const sourceOffsetY =
      stemUnit *
      source.targets.length *
      (1 - Math.abs(sourceEdgeDistance) / source.targets.length);

    const targetOffsetY =
      stemUnit *
      target.sources.length *
      (1 - Math.abs(targetEdgeDistance) / target.sources.length);

    const sourceStem = [
      {
        x: source.x + sourceOffsetX,
        y: nodeBottom(source),
      },
      {
        x: source.x + sourceOffsetX,
        y: nodeBottom(source) + stemMinSource,
      },
      {
        x: source.x + sourceOffsetX,
        y:
          nodeBottom(source) + stemMinSource + Math.min(sourceOffsetY, stemMax),
      },
    ];

    const targetStem = [
      {
        x: target.x + targetOffsetX,
        y: nodeTop(target) - stemMinTarget - Math.min(targetOffsetY, stemMax),
      },
      {
        x: target.x + targetOffsetX,
        y: nodeTop(target) - stemMinTarget,
      },
      {
        x: target.x + targetOffsetX,
        y: nodeTop(target),
      },
    ];

    const points = [...sourceStem, ...edge.points, ...targetStem];
    let pointYMax = points[0].y;

    for (const point of points) {
      // point.x = point.x + edge.
      if (point.y < pointYMax) {
        point.y = pointYMax;
      } else {
        pointYMax = point.y;
      }
    }

    edge.points = points;
  }
};