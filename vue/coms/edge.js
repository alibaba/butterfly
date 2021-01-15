import {Edge} from 'butterfly-dag'

class DefaultEdge extends Edge {
  drawArrow(isShow) {
    let dom = super.drawArrow(isShow);
    return dom;
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

export default DefaultEdge;