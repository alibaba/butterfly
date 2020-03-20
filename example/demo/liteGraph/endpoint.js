'use strict';

const Endpoint = require('../../../index.js').Endpoint;
const $ = require('jquery');

class BaseEndpoint extends Endpoint {
  draw(obj) {
    let point = super.draw(obj);
    if(obj.id === "testGroup3_02" || obj.id === "testGroup3_03" || obj.id === 'testGroup2_02' || obj.id === 'testGroup2_03') {
      // 系统锚点灰色
      point.addClass('system-gray-point')
    } else if (obj.id === "widgest_1") {
      // 自定义锚点绿色
      point.addClass('wid_point left-point')
    } else {
      // 系统锚点绿色
      point.addClass('system-green-point');
    }
    return point[0];
  }
};
module.exports = BaseEndpoint;