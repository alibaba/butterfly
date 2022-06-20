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
} from './commonRow';

export const routing = ({
  nodes,
  edges,
  spaceY,
  spaceX,
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
      (source.height - stemSpaceSource) / source.targets.length,
      stemSpaceSource
    );

    const sourceEdgeDistance =
      source.targets.indexOf(edge) - (source.targets.length - 1) * 0.5;

    const sourceOffsetY = sourceSeparation * sourceEdgeDistance;

    const startPoint = { y: source.y + sourceOffsetY, x: source.x };
    let currentPoint = startPoint;

    for (let i = source.row + 1; i < target.row; i += 1) {
      const firstNode = rows[i][0];

      let nearestPoint = { y: nodeTop(firstNode) - spaceY, x: firstNode.x };
      let nearestDistance = Infinity;

      const rowExtended = [
        { ...firstNode, y: Number.MIN_SAFE_INTEGER },
        ...rows[i],
        { ...firstNode, y: Number.MAX_SAFE_INTEGER },
      ];

      for (let i = 0; i < rowExtended.length - 1; i += 1) {
        const node = rowExtended[i];
        const nextNode = rowExtended[i + 1];
        const nodeGap = nodeTop(nextNode) - nodeBottom(node);

        if (nodeGap < minPassageGap) {
          continue;
        }

        const offsetY = Math.min(spaceY, nodeGap * 0.5);

        const candidatePoint = nearestOnLine(
          currentPoint.x,
          currentPoint.y,
          nodeBottom(node) + offsetY,
          nodeLeft(node) - spaceX,
          nodeTop(nextNode) - offsetY,
          nodeLeft(nextNode) - spaceX
        );

        const distance = distance1d(currentPoint.y, candidatePoint.y);

        if (distance > nearestDistance) {
          break;
        }

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPoint = candidatePoint;
        }
      }

      const offsetX = firstNode.width + spaceX;
      edge.points.push({
        y: nearestPoint.y + sourceOffsetY,
        x: nearestPoint.x,
      });
      edge.points.push({
        y: nearestPoint.y + sourceOffsetY,
        x: nearestPoint.x + offsetX,
      });

      currentPoint = {
        y: nearestPoint.y,
        x: nearestPoint.x + offsetX,
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
      (source.height - stemSpaceSource) / source.targets.length,
      stemSpaceSource
    );

    const targetSeparation = Math.min(
      (target.height - stemSpaceTarget) / target.sources.length,
      stemSpaceTarget
    );

    const sourceEdgeDistance =
      source.targets.indexOf(edge) - (source.targets.length - 1) * 0.5;
    const targetEdgeDistance =
      target.sources.indexOf(edge) - (target.sources.length - 1) * 0.5;

    const sourceOffsetY = sourceSeparation * sourceEdgeDistance;
    const targetOffsetY = targetSeparation * targetEdgeDistance;

    const sourceOffsetX =
      stemUnit *
      source.targets.length *
      (1 - Math.abs(sourceEdgeDistance) / source.targets.length);

    const targetOffsetX =
      stemUnit *
      target.sources.length *
      (1 - Math.abs(targetEdgeDistance) / target.sources.length);

    const sourceStem = [
      {
        y: source.y + sourceOffsetY,
        x: nodeRight(source),
      },
      {
        y: source.y + sourceOffsetY,
        x: nodeRight(source) + stemMinSource,
      },
      {
        y: source.y + sourceOffsetY,
        x:
          nodeRight(source) + stemMinSource + Math.min(sourceOffsetX, stemMax),
      },
    ];

    const targetStem = [
      {
        y: target.y + targetOffsetY,
        x: nodeLeft(target) - stemMinTarget - Math.min(targetOffsetX, stemMax),
      },
      {
        y: target.y + targetOffsetY,
        x: nodeLeft(target) - stemMinTarget,
      },
      {
        y: target.y + targetOffsetY,
        x: nodeLeft(target),
      },
    ];
    const points = [...sourceStem, ...edge.points, ...targetStem];

    let pointXMax = points[0].x;

    for (const point of points) {
      // point.x = point.x + edge.
      if (point.x < pointXMax) {
        point.x = pointXMax;
      } else {
        pointXMax = point.x;
      }
    }

    edge.points = points;
  }
};
