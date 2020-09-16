'use strict';
const SPEED_DIVISOR = 800;
function fruchterman (param) {
    const self = param.opts
    const nodes = param.data.nodes;
  
    const center = self.center;
  
    if (!nodes || nodes.length === 0) {
      return;
    }
    if (nodes.length === 1) {
      nodes[0].x = center[0];
      nodes[0].y = center[1];
      return;
    }
    const nodeMap = {};
    const nodeIdxMap = {};
    nodes.forEach((node, i) => {
      if ( !_.isNumber(node.x)) node.x = Math.random() * self.width;
      if ( !_.isNumber(node.y)) node.y = Math.random() * self.height;
      nodeMap[node.id] = node;
      nodeIdxMap[node.id] = i;
    });
    self.nodeMap = nodeMap;
    self.nodeIdxMap = nodeIdxMap;
    
    // layout
    run(param);
  }
  
   function run(param) {
    const self = param.opts;
    const nodes = param.data.nodes;
    const edges = param.data.edges;
    const maxIteration = self.maxIteration;
    if (!self.width && typeof window !== 'undefined') {
      self.width = window.innerWidth;
    }
    if (!self.height && typeof window !== 'undefined') {
      self.height = window.innerHeight;
    }
    const center = self.center;
    const maxDisplace = self.width / 10;
    const k = Math.sqrt((self.width * self.height) / (nodes.length + 1));
    const gravity = self.gravity;
    const speed = self.speed;
    const clustering = self.clustering;
    const clusterMap= {};
    if (clustering) {
      nodes.forEach((n) => {
        if (clusterMap[n.cluster] === undefined) {
          const cluster = {
            name: n.cluster,
            cx: 0,
            cy: 0,
            count: 0,
          };
          clusterMap[n.cluster] = cluster;
        }
        const c = clusterMap[n.cluster];
        if ( _.isNumber( n.x)) {
          c.cx += n.x;
        }
        if ( _.isNumber( n.y)) {
          c.cy += n.y;
        }
        c.count++;
      });
      for (const key in clusterMap) {
        clusterMap[key].cx /= clusterMap[key].count;
        clusterMap[key].cy /= clusterMap[key].count;
      }
    }
    for (let i = 0; i < maxIteration; i++) {
      const displacements = [];
      nodes.forEach((_, j) => {
        displacements[j] = { x: 0, y: 0 };
      });
  
      applyCalculate(nodes, edges, displacements, k,self);
  
      // gravity for clusters
      if (clustering) {
        const clusterGravity = self.clusterGravity || gravity;
        nodes.forEach((n, j) => {
          if ( !_.isNumber(n.x) ||  !_.isNumber(n.y)) return;
          const c = clusterMap[n.cluster];
          const distLength = Math.sqrt((n.x - c.cx) * (n.x - c.cx) + (n.y - c.cy) * (n.y - c.cy));
          const gravityForce = k * clusterGravity;
          displacements[j].x -= (gravityForce * (n.x - c.cx)) / distLength;
          displacements[j].y -= (gravityForce * (n.y - c.cy)) / distLength;
        });
  
        for (const key in clusterMap) {
          clusterMap[key].cx = 0;
          clusterMap[key].cy = 0;
          clusterMap[key].count = 0;
        }
  
        nodes.forEach((n) => {
          const c = clusterMap[n.cluster];
          if ( _.isNumber(n.x )) {
            c.cx += n.x;
          }
          if ( _.isNumber(n.y )) {
            c.cy += n.y;
          }
          c.count++;
        });
        for (const key in clusterMap) {
          clusterMap[key].cx /= clusterMap[key].count;
          clusterMap[key].cy /= clusterMap[key].count;
        }
      }
  
     // gravity
     nodes.forEach((n, j) => {
        if (!_.isNumber(n.x) || !_.isNumber(n.y)) return;
        const gravityForce = 0.01 * k * gravity;
        displacements[j].x -= gravityForce * (n.x - center[0]);
        displacements[j].y -= gravityForce * (n.y - center[1]);
      });
      // move
      nodes.forEach((n, j) => {
        if (!_.isNumber(n.x) || !_.isNumber(n.y)) return;
        const distLength = Math.sqrt(
          displacements[j].x * displacements[j].x + displacements[j].y * displacements[j].y,
        );
        if (distLength > 0) {
          // && !n.isFixed()
          const limitedDist = Math.min(maxDisplace * (speed / SPEED_DIVISOR), distLength);
          n.x += (displacements[j].x / distLength) * limitedDist;
          n.y += (displacements[j].y / distLength) * limitedDist;
        }
      });
    }
  }
  
   function applyCalculate(nodes, edges, displacements, k,self) {
    calRepulsive(nodes, displacements, k);
    calAttractive(edges, displacements, k,self);
  }
  
  function calRepulsive(nodes , displacements, k) {
    nodes.forEach((v, i) => {
      displacements[i] = { x: 0, y: 0 };
      nodes.forEach((u, j) => {
        if (i === j) {
          return;
        }
        if (!_.isNumber(v.x) || !_.isNumber(u.x) || !_.isNumber(v.y) || !_.isNumber(u.y)) return;
        let vecX = v.x - u.x;
        let vecY = v.y - u.y;
        let vecLengthSqr = vecX * vecX + vecY * vecY;
        if (vecLengthSqr === 0) {
          vecLengthSqr = 1;
          const sign = i > j ? 1 : -1;
          vecX = 0.01 * sign;
          vecY = 0.01 * sign;
        }
        const common = (k * k) / vecLengthSqr;
        displacements[i].x += vecX * common;
        displacements[i].y += vecY * common;
      });
    });
  }
  
  function calAttractive(edges, displacements, k,self) {
    edges.forEach((e) => {
      if (!e.source || !e.target) return;
      const uIndex = self.nodeIdxMap[e.source];
      const vIndex = self.nodeIdxMap[e.target];
      if (uIndex === vIndex) {
        return;
      }
      const u = self.nodeMap[e.source];
      const v = self.nodeMap[e.target];
      if (!_.isNumber(v.x) || !_.isNumber(u.x) || !_.isNumber(v.y) || !_.isNumber(u.y)) return;
      const vecX = v.x - u.x;
      const vecY = v.y - u.y;
      const vecLength = Math.sqrt(vecX * vecX + vecY * vecY);
      const common = (vecLength * vecLength) / k;
      displacements[vIndex].x -= (vecX / vecLength) * common;
      displacements[vIndex].y -= (vecY / vecLength) * common;
      displacements[uIndex].x += (vecX / vecLength) * common;
      displacements[uIndex].y += (vecY / vecLength) * common;
    });
  }
module.exports = fruchterman;
//   export default {
//     fruchterman
//   };