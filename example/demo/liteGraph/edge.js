import {Edge} from 'butterfly-dag';
import $ from 'jquery';

class BaseEdge extends Edge {
  draw(obj) {
    let path = super.draw(obj);
    $(path).addClass('test-base-link');
    return path;
  }
  drawLabel(texts) {
  }
}

export default BaseEdge;
