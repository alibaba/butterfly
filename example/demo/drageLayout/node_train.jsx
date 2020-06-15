'use strict';

const Node = require('./base_node.jsx');
const $ = require('jquery');

class Train extends Node {
  constructor(...args) {
    super(...args);
  }
  genLogo = () => {
    return $('<i class="iconfont datac-icon">&#xe7fa;</i>');
  }
}

module.exports = Train;
