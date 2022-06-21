/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
*/
export const HALF_PI = Math.PI * 0.5;

export const clamp = (value, min, max) =>
  value < min ? min : value > max ? max : value;

export const snap = (value, unit) => Math.round(value / unit) * unit;

export const distance1d = (a, b) => Math.abs(a - b);

export const angle = (a, b) => Math.atan2(a.y - b.y, a.x - b.x);

export const nodeLeft = (node) => node.x - node.width * 0.5;

export const nodeRight = (node) => node.x + node.width * 0.5;

export const nodeTop = (node) => node.y - node.height * 0.5;

export const nodeBottom = (node) => node.y + node.height * 0.5;

export const groupByRow = (nodes, direction) => {
  const rows = {};

  for (const node of nodes) {
    if(direction === "column") {
      rows[node.y] = rows[node.y] || [];
      rows[node.y].push(node);
    } else {
      rows[node.x] = rows[node.x] || [];
      rows[node.x].push(node);
    }
  }

  const rowNumbers = Object.keys(rows).map((row) => parseFloat(row));
  rowNumbers.sort((a, b) => a - b);

  const sortedRows = rowNumbers.map((row) => rows[row]);
  for (let i = 0; i < sortedRows.length; i += 1) {
    if(direction === "column") {
      sortedRows[i].sort((a, b) => compare(a.x, b.x, a.id, b.id));
    } else {
      sortedRows[i].sort((a, b) => compare(a.y, b.y, a.id, b.id));
    }

    for (const node of sortedRows[i]) {
      node.row = i;
    }
  }

  return sortedRows;
};

export const compare = (a, b, ...values) => {
  const delta = typeof a === "string" ? a.localeCompare(b) : a - b;
  return delta !== 0 || values.length === 0 ? delta : compare(...values);
};

export const offsetNode = (node, offset) => {
  node.x = node.x - offset.x;
  node.y = node.y - offset.y;
  node.order = node.x + node.y * 9999;
  return node;
};

export const offsetEdge = (edge, offset) => {
  edge.points.forEach((point) => {
    point.x = point.x - offset.x;
    point.y = point.y - offset.y;
  });
  return edge;
};

export const nearestOnLine = (x, y, ax, ay, bx, by) => {
  const dx = bx - ax;
  const dy = by - ay;
  const position = ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1);
  const positionClamped = clamp(position, 0, 1);

  return {
    x: ax + dx * positionClamped,
    y: ay + dy * positionClamped,
    ax,
    ay,
    bx,
    by,
  };
};
