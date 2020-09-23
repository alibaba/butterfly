const Canvas = require('../../../index.js').Canvas;

class RelationalBooksCanvas extends Canvas {
  constructor(...args) {
    super(...args);
    this.on('InnerEvents', (data) => {
      if (data.type === 'node:removeEndpoint') {
        let edges = this.getNeighborEdges(data.data.nodeId);
        edges.forEach((item) => {
          item.redraw();
        })
      }
    })
  }
}

module.exports = RelationalBooksCanvas;