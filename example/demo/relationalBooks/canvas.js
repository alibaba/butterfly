import {Canvas} from 'butterfly-dag';

class RelationalBooksCanvas extends Canvas {
  constructor(...args) {
    super(...args);
    this.on('InnerEvents', (data) => {
      if (data.type === 'node:removeEndpoint') {
        let edges = this.getNeighborEdges(data.data.nodeId);
        edges.forEach((item) => {
          item.redraw();
        });
      }
    });
  }
}

export default RelationalBooksCanvas;
