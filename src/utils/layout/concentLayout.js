// 同心圆布局
function concentLayout(param) {
    let {
      center,
      nodeSize,
      minNodeSpacing,
      preventOverlap,
      sweep,
      equidistant,
      startAngle = (3 / 2) * Math.PI,
      clockwise,
      maxLevelDiff,
      sortBy,
      width,
      height,
      data,
    } = param;
    const curnode = data.nodes;
    const curedges = data.edges;
    let nodes = curnode.map((item) => {
      return {
        id: item.id,
        top: item.top,
        left: item.left,
        degree: item.degree,
        size: item.size,
      }
    });
    let edges = curedges.map((item) => {
      return {
        source: item.source,
        target: item.target,
      }
    });
    const n = nodes.length;
    let maxValueNode;
    let counterclockwise;
    if (n === 0) {
      return;
    }
    if (n === 1) {
      nodes[0].x = center[0];
      nodes[0].y = center[1];
      return;
    }
    const layoutNodes = [];
    let maxNodeSize;
    if (_.isArray(nodeSize)) {
      maxNodeSize = Math.max(nodeSize[0], nodeSize[1]);
    } else {
      maxNodeSize = nodeSize;
    }
    nodes.forEach(node => {
      layoutNodes.push(node);
      let nodeSize = maxNodeSize;
      if (_.isArray(node.size)) {
        nodeSize = Math.max(node.size[0], node.size[1]);
      } else if (_.isNumber(node.size)) {
        nodeSize = node.size;
      }
      maxNodeSize = Math.max(maxNodeSize, nodeSize);
    });
    if (!width && typeof window !== 'undefined') {
      width = window.innerWidth;
    }
    if (!height && typeof window !== 'undefined') {
      height = window.innerHeight;
    }
    clockwise = counterclockwise !== undefined ? !counterclockwise : clockwise;
  
    // layout
    const nodeMap = {};
    const nodeIdxMap = {};
    layoutNodes.forEach((node, i) => {
      nodeMap[node.id] = node;
      nodeIdxMap[node.id] = i;
    });
  
    // get the node degrees
    if (
      sortBy === 'degree' ||
      !_.isString(sortBy) ||
      layoutNodes[0][sortBy] === undefined
    ) {
      sortBy = 'degree';
      if (!_.isNumber(nodes[0].degree)) {
        let values = [];
        const len = nodes.length
        for (let i = 0; i < len; i++) {
          values[i] = 0;
        }
        edges.forEach(e => {
          if (e.source) {
            values[nodeIdxMap[e.source]] += 1;
          }
          if (e.target) {
            values[nodeIdxMap[e.target]] += 1;
          }
        });
        layoutNodes.forEach((node, i) => {
          node.degree = values[i];
        });
      }
    }
    // sort nodes by value
    layoutNodes.sort((n1, n2) => n2[sortBy] - n1[sortBy]);
    maxValueNode = layoutNodes[0];
    maxLevelDiff = maxLevelDiff || maxValueNode[sortBy] / 4;
  
    // put the values into levels
    const levels = [[]];
    let currentLevel = levels[0];
    layoutNodes.forEach(node => {
      if (currentLevel.length > 0) {
        const diff = Math.abs(currentLevel[0][sortBy] - node[sortBy]);
        if (maxLevelDiff && diff >= maxLevelDiff) {
          currentLevel = [];
          levels.push(currentLevel);
        }
      }
      currentLevel.push(node);
    });
  
    // create positions for levels
    let minDist = maxNodeSize + minNodeSpacing; // min dist between nodes
    if (!preventOverlap) {
      // then strictly constrain to bb
      const firstLvlHasMulti = levels.length > 0 && levels[0].length > 1;
      const maxR = Math.min(width, height) / 2 - minDist;
      const rStep = maxR / (levels.length + (firstLvlHasMulti ? 1 : 0));
  
      minDist = Math.min(minDist, rStep);
    }
  
    // find the metrics for each level
    let r = 0;
    levels.forEach(level => {
      let sweep = sweep;
      if (sweep === undefined) {
        sweep = 2 * Math.PI - (2 * Math.PI) / level.length;
      }
      const dTheta = (level.dTheta = sweep / Math.max(1, level.length - 1));
  
      // calculate the radius
      if (level.length > 1 && preventOverlap) {
        // but only if more than one node (can't overlap)
        const dcos = Math.cos(dTheta) - Math.cos(0);
        const dsin = Math.sin(dTheta) - Math.sin(0);
        const rMin = Math.sqrt((minDist * minDist) / (dcos * dcos + dsin * dsin)); // s.t. no nodes overlapping
  
        r = Math.max(rMin, r);
      }
      level.r = r;
      r += minDist;
    });
  
    if (equidistant) {
      let rDeltaMax = 0;
      let rr = 0;
      for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        const rDelta = level.r - rr;
        rDeltaMax = Math.max(rDeltaMax, rDelta);
      }
      rr = 0;
      levels.forEach((level, i) => {
        if (i === 0) {
          rr = level.r;
        }
        level.r = rr;
        rr += rDeltaMax;
      });
    }
  
    // calculate the node positions
    levels.forEach(level => {
      const dTheta = level.dTheta;
      const rr = level.r;
      level.forEach((node, j) => {
        const theta = startAngle + (clockwise ? 1 : -1) * dTheta * j;
        node.x = center[0] + rr * Math.cos(theta);
        node.y = center[1] + rr * Math.sin(theta);
      });
    });
  
    param.data.nodes.forEach((node, index) => {
      node.top = nodes[index].y;
      node.left = nodes[index].x;
    });
  }

module.exports = concentLayout