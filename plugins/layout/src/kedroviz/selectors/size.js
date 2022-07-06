/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
*/
export const bounds = (nodes, padding) => {
  const size = {
    min: { x: Infinity, y: Infinity },
    max: { x: -Infinity, y: -Infinity },
  };

  for (const node of nodes) {
    const x = node.x || node.left;
    const y = node.y || node.top;

    if (x < size.min.x) {
      size.min.x = x;
    }
    if (x > size.max.x) {
      size.max.x = x;
    }
    if (y < size.min.y) {
      size.min.y = y;
    }
    if (y > size.max.y) {
      size.max.y = y;
    }
  }

  size.width = size.max.x - size.min.x + 2 * padding;
  size.height = size.max.y - size.min.y + 2 * padding;
  size.min.x -= padding;
  size.min.y -= padding;

  return size;
};