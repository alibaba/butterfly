import {
  rowConstraint,
  layerConstraint,
  parallelConstraint,
  crossingConstraint,
  separationConstraint,
} from './constraintsRow';
import { solveLoose, solveStrict } from './solver';
import { HALF_PI, snap, angle, compare, groupByRow } from './commonRow';

export const layout = ({
  nodes,
  edges,
  layers,
  spaceY,
  spaceX,
  spreadY,
  layerSpaceX,
  iterations,
}) => {
  for (const node of nodes) {
    node.x = 0;
    node.y = 0;
  }

  const constants = {
    spaceY,
    spaceX,
    spreadY,
    layerSpace: (spaceX + layerSpaceX) * 0.5,
  };

  const rowConstraints = createRowConstraints(edges);
  const layerConstraints = createLayerConstraints(nodes, layers);

  // 找到给定这些约束的节点位置
  solveStrict([...rowConstraints, ...layerConstraints], constants, 1);

  // 求解后，使用节点位置查找已求解的行
  const rows = groupByRow(nodes);
  console.log("rows",rows);

  // 避免边交叉并保持平行垂直边的约束
  const crossingConstraints = createCrossingConstraints(edges, constants);
  const parallelConstraints = createParallelConstraints(edges, constants);

  for (let i = 0; i < iterations; i += 1) {
    solveLoose(crossingConstraints, 1, constants);
    solveLoose(parallelConstraints, 50, constants);
  }

  // 保持最小水平节点间距的约束
  const separationConstraints = createSeparationConstraints(rows, constants);

  // 找到给定这些严格约束的最终节点位置
  solveStrict([...separationConstraints, ...parallelConstraints], constants, 1);

  // 调整行与行之间的垂直间距以提高可读性
  expandDenseRows(edges, rows, spaceX);
};

const createRowConstraints = (edges) =>
  edges.map((edge) => ({
    base: rowConstraint,
    a: edge.targetNodeObj,
    b: edge.sourceNodeObj,
  }));

const createLayerConstraints = (nodes, layers) => {
  const layerConstraints = [];

  if (!layers) {
    return layerConstraints;
  }

  const layerGroups = layers.map((item) =>
    nodes.filter((node) => node.nearestLayer === item)
  );

  for (let i = 0; i < layerGroups.length - 1; i += 1) {
    const layerNodes = layerGroups[i];
    const nextLayerNodes = layerGroups[i + 1];

    const intermediary = { id: `layer-${i}`, x: 0, y: 0 };

    for (const node of layerNodes) {
      layerConstraints.push({
        base: layerConstraint,
        a: intermediary,
        b: node,
      });
    }

    // 将下一层中的每个节点约束到中间层下方
    for (const node of nextLayerNodes) {
      layerConstraints.push({
        base: layerConstraint,
        a: node,
        b: intermediary,
      });
    }
  }

  return layerConstraints;
};

const createCrossingConstraints = (edges, constants) => {
  const { spaceY } = constants;
  const crossingConstraints = [];

  for (let i = 0; i < edges.length; i += 1) {
    const edgeA = edges[i];
    const { sourceNodeObj: sourceA, targetNodeObj: targetA } = edgeA;

    const edgeADegree =
      sourceA.sources.length +
      sourceA.targets.length +
      targetA.sources.length +
      targetA.targets.length;

    for (let j = i + 1; j < edges.length; j += 1) {
      const edgeB = edges[j];
      const { sourceNodeObj: sourceB, targetNodeObj: targetB } = edgeB;

      if (sourceA.row >= targetB.row || targetA.row <= sourceB.row) {
        continue;
      }

      const edgeBDegree =
        sourceB.sources.length +
        sourceB.targets.length +
        targetB.sources.length +
        targetB.targets.length;

      crossingConstraints.push({
        base: crossingConstraint,
        edgeA: edgeA,
        edgeB: edgeB,
        separationA: sourceA.height * 0.5 + spaceY + sourceB.height * 0.5,
        separationB: targetA.height * 0.5 + spaceY + targetB.height * 0.5,
        strength: 1 / Math.max(1, (edgeADegree + edgeBDegree) / 4),
      });
    }
  }

  return crossingConstraints;
};

const createParallelConstraints = (edges) =>
  edges.map(({ sourceNodeObj, targetNodeObj }) => ({
    base: parallelConstraint,
    a: sourceNodeObj,
    b: targetNodeObj,
    strength:
      0.6 /
      Math.max(1, sourceNodeObj.targets.length + targetNodeObj.sources.length - 2),
  }));

const createSeparationConstraints = (rows, constants) => {
  const { spaceY } = constants;
  const separationConstraints = [];

  for (let i = 0; i < rows.length; i += 1) {
    const rowNodes = rows[i];

    rowNodes.sort((a, b) => compare(a.y, b.y, a.id, b.id));

    for (let j = 0; j < rowNodes.length - 1; j += 1) {
      const nodeA = rowNodes[j];
      const nodeB = rowNodes[j + 1];

      const degreeA = Math.max(
        1,
        nodeA.targets.length + nodeA.sources.length - 2
      );
      const degreeB = Math.max(
        1,
        nodeB.targets.length + nodeB.sources.length - 2
      );

      const spread = Math.min(10, degreeA * degreeB * constants.spreadY);
      const space = snap(spread * spaceY, spaceY);

      separationConstraints.push({
        base: separationConstraint,
        a: nodeA,
        b: nodeB,
        separation: nodeA.height * 0.5 + space + nodeB.height * 0.5,
      });
    }
  }

  return separationConstraints;
};

const expandDenseRows = (edges, rows, spaceX, scale = 1.25, unit = 0.25) => {
  const densities = rowDensity(edges);
  const spaceXUnit = Math.round(spaceX * unit);
  let currentOffsetX = 0;

  for (let i = 0; i < rows.length - 1; i += 1) {
    const densitx = densities[i] || 0;

    const offsetX = snap(densitx * scale * spaceX, spaceXUnit);
    currentOffsetX += offsetX;

    for (const node of rows[i + 1]) {
      node.x += currentOffsetX;
    }
  }
};

const rowDensity = (edges) => {
  const rows = {};

  for (const edge of edges) {
    const edgeAngle =
      Math.abs(angle(edge.targetNodeObj, edge.sourceNodeObj) - HALF_PI) / HALF_PI;

    const sourceRow = edge.sourceNodeObj.row;
    const targetRow = edge.targetNodeObj.row - 1;

    rows[sourceRow] = rows[sourceRow] || [0, 0];
    rows[sourceRow][0] += edgeAngle;
    rows[sourceRow][1] += 1;

    if (targetRow !== sourceRow) {
      rows[targetRow] = rows[targetRow] || [0, 0];
      rows[targetRow][0] += edgeAngle;
      rows[targetRow][1] += 1;
    }
  }

  for (const row in rows) {
    rows[row] = rows[row][0] / (rows[row][1] || 1);
  }

  return Object.values(rows);
};