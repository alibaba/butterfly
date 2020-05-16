'use strict';

const Node = require('../../../index.js').Node;
import _ from 'lodash';
// const Node = require('../../../services/butterflies/src/node/baseNode');
const $ = require('jquery');
import tip from '../../../src/utils/toolTip';

require('./node.less');
class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.id = opts.id;
    this.top = opts.top;
    this.left = opts.left;
    this.options = opts;
  }

  draw = (opts) => {
    let container = $(`<div class="force-node"></div>`)
      .css('top', opts.top + 'px')
      .css('left', opts.left + 'px')
      .attr('id', opts.id);

    container.text(opts.options.index);

    opts.content = `<div>${opts.id}</div>`;
    const callBack = (d, e) => {
      console.log(['回调', d, e]);
    };

    const container_ = tip.creatTips(opts, container, callBack);
    const container__ = tip.creatMenus(
      opts,
      container_,
      callBack,
      [
        {key: 1, value: '新增'},
        {key: 2, value: '删除'},
      ],
      false,
    );

    return container__[0];
  };
}

module.exports = BaseNode;
