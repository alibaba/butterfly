'use strict';

const Node = require('./base_node.jsx');
const $ = require('jquery');

class People extends Node {
  constructor(...args) {
    super(...args);
  }
  genLogo = () => {
    return $('<i class="iconfont datac-icon">&#xe69e;</i>');
  }
}

module.exports = People;
