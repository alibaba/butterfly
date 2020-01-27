'use strict';

const Endpoint = require('butterfly-dag').Endpoint;
const $ = require('jquery');

class BaseEndpoint extends Endpoint {
  draw(obj) {
    let point = super.draw(obj);
    point.addClass('purple-point');
    return point[0];
  }
};
module.exports = BaseEndpoint;