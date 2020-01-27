
'use strict';

const Node = require('./base_node.jsx');
const $ = require('jquery');

class Phone extends Node {
  constructor(...args) {
    super(...args);
  }
  genLogo = () => {
    return $('<i class="iconfont datac-icon">&#xe628;</i>');
  }
}

module.exports = Phone;
