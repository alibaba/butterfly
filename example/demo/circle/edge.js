'use strict';

import { Edge } from 'butterfly-dag';
import $ from 'jquery';
import './edge.less';
class BaseEdge extends Edge {
  draw(obj) {
    let path = super.draw(obj);
    $(path).addClass('orange-dash-path');
    return path;
  }
};
export default BaseEdge;