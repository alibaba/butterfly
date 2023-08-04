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
  draw(obj) {
    const target = super.draw(obj)
    if(target){
      target.addEventListener('mouseover',(e)=>{
        this.emit('events', {
          type: 'link:mouseover',
          edge: this,
          event:e
        });
      })
      target.addEventListener('mouseout',(e)=>{
        this.emit('events', {
          type: 'link:mouseout',
          edge: this,
          event:e
        });
      })
    }
    return target 
  }
}

export default DefaultEdge;