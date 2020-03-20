
'use strict';

const Node = require('./base_node.jsx');
const $ = require('jquery');

class Email extends Node {
  constructor(...args) {
    super(...args);
  }
  genLogo = () => {
    return $('<i class="iconfont datac-icon">&#xe648;</i>');
  }
}

module.exports = Email;
