import $ from 'jquery';
import {Edge} from 'butterfly-dag';

import './edge.less';

class BaseEdge extends Edge {
  draw(obj) {
    let path = super.draw(obj);
    $(path).addClass('orange-dash-path');
    return path;
  }
}

export default BaseEdge;
