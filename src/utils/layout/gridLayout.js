
function gridLayout (param) {
    const self = param.opts;
    const nodes = param.data.nodes;
    const n = nodes.length;
    const center = self.center;
    if (n === 0) {
      return;
    }
    if (n === 1) {
      nodes[0].x = center[0];
      nodes[0].y = center[1];
      return;
    }
  
    const edges = param.data.edges;
    const layoutNodes = [];
    nodes.forEach((node) => {
      layoutNodes.push(node);
    });
    const nodeIdxMap = {};
    layoutNodes.forEach((node, i) => {
      nodeIdxMap[node.id] = i;
    });
  
    // 排序
    if (
      self.sortBy === 'degree' ||
      typeof self.sortBy === 'string' ||
      layoutNodes[0][self.sortBy] === undefined
    ) {
      self.sortBy = 'degree';
      if (isNaN(nodes[0].degree)) {
        const values = getDegree(layoutNodes.length, nodeIdxMap, edges);
        layoutNodes.forEach((node, i) => {
          node.degree = values[i];
        });
      }
    }
    // sort nodes by value
    layoutNodes.sort((n1, n2) => (n2)[self.sortBy] - (n1)[self.sortBy]);
  
    if (!self.width && typeof window !== 'undefined') {
      self.width = window.innerWidth;
    }
    if (!self.height && typeof window !== 'undefined') {
      self.height = window.innerHeight;
    }
  
    const oRows = self.rows;
    const oCols = self.cols != null ? self.cols : self.columns;
    self.cells = n;
  
    // if rows or columns were set in self, use those values
    if (oRows != null && oCols != null) {
      self.rows = oRows;
      self.cols = oCols;
    } else if (oRows != null && oCols == null) {
      self.rows = oRows;
      self.cols = Math.ceil(self.cells / self.rows);
    } else if (oRows == null && oCols != null) {
      self.cols = oCols;
      self.rows = Math.ceil(self.cells / self.cols);
    } else {
      // otherwise use the automatic values and adjust accordingly	      // otherwise use the automatic values and adjust accordingly
      // width/height * splits^2 = cells where splits is number of times to split width
      self.splits = Math.sqrt((self.cells * self.height) / self.width);
      self.rows = Math.round(self.splits);
      self.cols = Math.round((self.width / self.height) * self.splits);
    }
  
    self.cellWidth = self.width / self.cols;
    self.cellHeight = self.height / self.rows;
  
    if (self.condense) {
      self.cellWidth = 0;
      self.cellHeight = 0;
    }
  
    if (self.preventOverlap) {
      layoutNodes.forEach((node) => {
        if (!node.x || !node.y) {
          // for bb
          node.x = 0;
          node.y = 0;
        }
  
        let nodew;
        let nodeh;
        // if (isArray(node.size)) {
        //   nodew = node.size[0];
        //   nodeh = node.size[1];
        // } else 
        if ( typeof node.size === 'number') {
          nodew = node.size;
          nodeh = node.size;
        }
        if (nodew === undefined || nodeh === undefined) {
          // if (isArray(self.nodeSize)) {
          //   nodew = self.nodeSize[0];
          //   nodeh = self.nodeSize[1];
          // } else 
          if ( typeof node.nodeSize === 'number') {
            nodew = self.nodeSize;
            nodeh = self.nodeSize;
          } else {
            nodew = 30;
            nodeh = 30;
          }
        }
  
        const p = self.preventOverlapPadding;
  
        const w = nodew + p;
        const h = nodeh + p;
  
        self.cellWidth = Math.max(self.cellWidth, w);
        self.cellHeight = Math.max(self.cellHeight, h);
      });
    }
  
    self.cellUsed = {}; // e.g. 'c-0-2' => true
  
    // to keep track of current cell position
    self.row = 0;
    self.col = 0;
  
    // get a cache of all the manual positions
    self.id2manPos = {};
    for (let i = 0; i < layoutNodes.length; i++) {
      const node = layoutNodes[i];
      let rcPos;
      if (self.position) {
        rcPos = self.position(node);
      }
  
      if (rcPos && (rcPos.row !== undefined || rcPos.col !== undefined)) {
        // must have at least row or col def'd
        const pos = {
          row: rcPos.row,
          col: rcPos.col,
        };
  
        if (pos.col === undefined) {
          // find unused col
          pos.col = 0;
  
          while (used(pos.row, pos.col,self)) {
            pos.col++;
          }
        } else if (pos.row === undefined) {
          // find unused row
          pos.row = 0;
  
          while (used(pos.row, pos.col,self)) {
            pos.row++;
          }
        }
  
        self.id2manPos[node.id] = pos;
        use(pos.row, pos.col);
      }
      getPos(node,self);
    }
    
  }
  
  function getDegree (n, nodeIdxMap, edges) {
    const degrees = [];
    for (let i = 0; i < n; i++) {
      degrees[i] = 0;
    }
    edges.forEach((e) => {
      if (e.source) {
        degrees[nodeIdxMap[e.source]] += 1;
      }
      if (e.target) {
        degrees[nodeIdxMap[e.target]] += 1;
      }
    });
    return degrees;
  };
  
  function use(row, col,self) {
    self.cellUsed[`c-${row}-${col}`] = true;
  }
  
  function used(row, col,self) {
    return self.cellUsed[`c-${row}-${col}`] || false;
  }
  
  function moveToNextCell(param) {
    const self = param;
    const cols = self.cols || 5;
    self.col++;
    if (self.col >= cols) {
      self.col = 0;
      self.row++;
    }
  }
  
  function getPos(node,param) {
    const self = param;
    const begin = self.begin;
    const cellWidth = self.width;
    const cellHeight = self.height;
    let x;
    let y;
  
    // see if we have a manual position set
    const rcPos = self.id2manPos[node.id];
    if (rcPos) {
      x = rcPos.col * cellWidth + cellWidth / 2 + begin[0];
      y = rcPos.row * cellHeight + cellHeight / 2 + begin[1];
    } else {
      // otherwise set automatically
      while (used(self.row, self.col,self)) {
        moveToNextCell(param);
      }
  
      x = self.col * cellWidth + cellWidth / 2 + begin[0];
      y = self.row * cellHeight + cellHeight / 2 + begin[1];
      use(self.row, self.col,self);
  
      moveToNextCell(param);
    }
    node.x = x;
    node.y = y;
    node.left = x;
    node.top = y
  }
  
  module.exports = gridLayout;