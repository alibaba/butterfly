'use strict';

import node from './base_node.jsx';
import $ from 'jquery';

class Train extends Node {
  constructor(...args) {
    super(...args);
  }
  genLogo = () => {
    return $('<i class="newIconfont iconapplication"></i>');
  }
}

module.exports = Train;
