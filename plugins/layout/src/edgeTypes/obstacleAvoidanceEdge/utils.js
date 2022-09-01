/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
*/
export const clamp = (value, min, max) =>
  value < min ? min : value > max ? max : value;

export const snap = (value, unit) => Math.round(value / unit) * unit;

export const distance1d = (a, b) => Math.abs(a - b);

export const angle = (a, b) => Math.atan2(a.y - b.y, a.x - b.x);

export const groupByRow = (nodes, rankdir) => {
  const rows = {};

  if(rankdir === "column") {
    for (const node of nodes) {
      rows[parseInt(node.y)] = rows[parseInt(node.y)] || [];
      rows[parseInt(node.y)].push(node);
    }
  } else {
    for (const node of nodes) {
      rows[parseInt(node.x)] = rows[parseInt(node.x)] || [];
      rows[parseInt(node.x)].push(node);
    }
  }

  //这里不应该是node.x，需要设置一个区间值 - 30
  let rowNumbers = Object.keys(rows).map((row) => parseInt(row));
  rowNumbers.sort((a, b) => a - b);
  let tag;
  let dis = 15;
  let resRows = {};
  for (let i = 0; i < rowNumbers.length; i++){
    if (i === 0 && !tag) {
      tag = rowNumbers[i];
    }else {
      if (Math.abs(rowNumbers[i] - tag) > dis) {
        tag=rowNumbers[i];   
      }
    }
    resRows[tag] = !resRows[tag] ? rows[tag] : [...resRows[tag], ...rows[rowNumbers[i]]];
  }

  let sortedRows = [];
  rowNumbers.forEach(item => {
    if (resRows[item]) {
      sortedRows.push(resRows[item]);
    }
  });

  if(rankdir === "column") {
    for (let i = 0; i < sortedRows.length; i += 1) {
      if (!!sortedRows[i]) {
        sortedRows[i].sort((a, b) => a.x - b.x);
        for (const node of sortedRows[i]) {
          node.row = i;
        }
      }
    }
  } else {
    for (let i = 0; i < sortedRows.length; i += 1) {
      if (!!sortedRows[i]) {
        sortedRows[i].sort((a, b) => a.y - b.y);
        for (const node of sortedRows[i]) {
          node.row = i;
        }
      }
    }
  }

  return sortedRows;
};

// export const compare = (a, b, ...values) => {
//   const delta = typeof a === "string" ? a.localeCompare(b) : a - b;
//   return delta !== 0 || values.length === 0 ? delta : compare(...values);
// };

export const nearestOnLine = (x, y, ax, ay, bx, by, isReverseEdge) => {
  // const dx =!isReverseEdge ? bx - ax : ax - bx;
  // const dy =!isReverseEdge ? by - ay : ay - by;
  const dx = bx - ax;
  const dy = by - ay;
  const position = ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1);
  const positionClamped = clamp(position, 0, 1);

  return {
    // x: !isReverseEdge ? ax + dx * positionClamped : ax - dx * positionClamped,
    // y: !isReverseEdge ? ay + dy * positionClamped : ay - dy * positionClamped,
    x: ax + dx * positionClamped,
    y: ay + dy * positionClamped,
    ax,
    ay,
    bx,
    by,
  };
};
