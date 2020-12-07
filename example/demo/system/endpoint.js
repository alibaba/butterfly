'use strict';

const Endpoint = require('../../../index.js').Endpoint;
const Tips = require('../../../index.js').Tips;
const $ = require('jquery');

class BaseEndpoint extends Endpoint {
  mounted() {
    Tips.creatTip({
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
};
module.exports = BaseEndpoint;