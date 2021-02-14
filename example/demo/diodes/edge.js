import {Edge} from 'butterfly-dag';
import $ from 'jquery';
class BaseEdge extends Edge {
  draw(obj) {
    let path = super.draw(obj);
    if (this.options.color) {
      $(path).addClass(this.options.color);
    }
    return path;
  }
}

export default BaseEdge;
