import {Endpoint, Tips} from 'butterfly-dag';
import $ from 'jquery';

class BaseEndpoint extends Endpoint {
  mounted() {
    Tips.createTip({
      targetDom: this.dom,
      genTipDom: (data) => {
        return $('<div>this is a tips</div>')[0];
      },
      placement: 'top'
    });
  }
  draw(obj) {
    let point = super.draw(obj);
    $(point).addClass('purple-point');
    return point;
  }
}

export default BaseEndpoint;
