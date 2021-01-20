'use strict';
function RadialNonoverlapForce(params) {
    let positions = params.positions;
    let adjMatrix = params.adjMatrix;
    let focusID = params.focusID;
    let radii = params.radii;
    let iterations = params.iterations || 10;
    let height = params.height || 10;
    let width = params.width || 10;
    let speed = params.speed || 100;
    let gravity = params.gravity || 10;
    let nodeSizeFunc = params.nodeSizeFunc;
    let k = params.k || 5;
    let strictRadial = params.strictRadial;
    let nodes = params.nodes;
    // const disp = [];
    // const maxDisplace = params.width / 10;
    // let maxDisplace = params.width / 10;
    let disp = [];
    for (let i = 0; i < iterations; i++) {
      positions.forEach((_, k) => {
        disp[k] = { x: 0, y: 0 };
      });
      // 给重叠的节点增加斥力
      getRepulsion(params);
      updatePositions(params);
    }
    return positions;
}
function getRepulsion(params) {
    const self = params;
    const positions = self.positions;
    const nodes = self.nodes;
    const disp = self.disp;
    const k = self.k;
    const radii = self.radii || [];

    positions.forEach((v, i) => {
      disp[i] = { x: 0, y: 0 };
      positions.forEach((u, j) => {
        if (i === j) {
          return;
        }
        // v and u are not on the same circle, return
        if (radii[i] !== radii[j]) {
          return;
        }
        let vecx = v[0] - u[0];
        let vecy = v[1] - u[1];
        let vecLength = Math.sqrt(vecx * vecx + vecy * vecy);
        if (vecLength === 0) {
          vecLength = 1;
          const sign = i > j ? 1 : -1;
          vecx = 0.01 * sign;
          vecy = 0.01 * sign;
        }
        // these two nodes overlap
        if (vecLength < self.nodeSizeFunc(nodes[i]) / 2 + self.nodeSizeFunc(nodes[j]) / 2) {
          const common = (k * k) / vecLength;
          disp[i].x += (vecx / vecLength) * common;
          disp[i].y += (vecy / vecLength) * common;
        }
      });
    });
  }

  function updatePositions(param) {
    const self = param;
    const positions = self.positions;
    const disp = self.disp;
    const speed = self.speed;
    const strictRadial = self.strictRadial;
    const f = self.focusID;
    const maxDisplace = self.maxDisplace || self.width / 10;

    if (strictRadial) {
      disp.forEach((di, i) => {
        const vx = positions[i][0] - positions[f][0];
        const vy = positions[i][1] - positions[f][1];
        const vLength = Math.sqrt(vx * vx + vy * vy);
        let vpx = vy / vLength;
        let vpy = -vx / vLength;
        const diLength = Math.sqrt(di.x * di.x + di.y * di.y);
        let alpha = Math.acos((vpx * di.x + vpy * di.y) / diLength);
        if (alpha > Math.PI / 2) {
          alpha -= Math.PI / 2;
          vpx *= -1;
          vpy *= -1;
        }
        const tdispLength = Math.cos(alpha) * diLength;
        di.x = vpx * tdispLength;
        di.y = vpy * tdispLength;
      });
    }

    // move
    const radii = self.radii;
    positions.forEach((n, i) => {
      if (i === f) {
        return;
      }
      const distLength = Math.sqrt(disp[i].x * disp[i].x + disp[i].y * disp[i].y);
      if (distLength > 0 && i !== f) {
        const limitedDist = Math.min(maxDisplace * (speed / SPEED_DIVISOR), distLength);
        n[0] += (disp[i].x / distLength) * limitedDist;
        n[1] += (disp[i].y / distLength) * limitedDist;
        if (strictRadial) {
          let vx = n[0] - positions[f][0];
          let vy = n[1] - positions[f][1];
          const nfDis = Math.sqrt(vx * vx + vy * vy);
          vx = (vx / nfDis) * radii[i];
          vy = (vy / nfDis) * radii[i];
          n[0] = positions[f][0] + vx;
          n[1] = positions[f][1] + vy;
        }
      }
    });
  }
module.exports = RadialNonoverlapForce