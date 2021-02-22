import {Edge} from 'butterfly-dag/es';


class CustomEdge extends Edge {
  constructor(options) {
    super(options);

    if (options && options.calcPath) {
      this.calcPath = options.calcPath;
    }
  }

  drawLabel() {
    const div = document.createElement('div');

    if (!this.id) {
      this.id = String(Number(new Date()));
    }

    div.id = `edge_label_${this.id}`;
    div.className = 'butterflies-label';

    return div;
  }
}


export default CustomEdge;
