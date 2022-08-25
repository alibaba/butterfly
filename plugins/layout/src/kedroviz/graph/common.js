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

  //这里不应该是node.x，需要设置一个区间值 - 8
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

  // for (let i = 0; i < rowNumbers.length; i++){
  //   for (let j = i+1; j < rowNumbers.length - 1; j++) {
  //     if ( Math.abs(rowNumbers[j] - rowNumbers[i]) < 30) {
  //       rowNumbers.splice(j, 1);
  //       j--;

  //     }
  //   }
  // }
 
  // let _rows = {};
  // let flag = [];
  // for (let rowItem in rows) {
  //   rowNumbers.forEach((item) => {
  //     if (Math.abs(rowItem - item) < 30 && !flag.includes(rowItem)) {
  //       flag.push(rowItem);
  //       _rows[item] = _rows[item] ? [..._rows[item], ...rows[rowItem]] : rows[rowItem];
  //     }
  //   });
  // }
  // const sortedRows = rowNumbers.map((row) => {
  //   if (!!resRows[row]) {
  //     return resRows[row];
  //   }
  // });

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
