import {Edge} from 'butterfly-dag'

class DefaultEdge extends Edge {
  drawArrow(isShow) {
    let dom = super.drawArrow(isShow);
    return dom;
  }
  drawLabel(text) {
    const div = document.createElement('div');

    if (!this.id) {
      this.id = String(Number(new Date()));
    }

    div.id = `edge_label_${this.id}`;
    div.className = 'butterflies-label';
    div.innerText = text;

    return div;
  }
}

export default DefaultEdge;
