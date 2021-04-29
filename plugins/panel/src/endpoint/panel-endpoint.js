import { Endpoint } from 'butterfly-dag';
// import Endpoint from '../../../../src/endpoint/baseEndpoint.js';
import $ from 'jquery';

import './panel-endpoint.less'

class controlEndPoint extends Endpoint {
  constructor(opts) {
    super(opts);
    this.isRotator = opts.rotator || false;
  }
  draw(obj) {
    let _dom = obj.dom;
    if (!_dom) {
      _dom = $('<div class="butterflie-circle-endpoint unactived"></div>').attr('id', this.id);
    } else {
      _dom = $(_dom);
    }
    return _dom[0];
  }

  attachEvent() {
    $(this.dom).on('mousedown', (e) => {
      const LEFT_KEY = 0;
      if (e.button !== LEFT_KEY) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.options._node.moveDirection = this.id;
      this.emit('InnerEvents', {
        type: 'node:resize',
        node: this.options._node,
      });
    });
  }

};
export default controlEndPoint;