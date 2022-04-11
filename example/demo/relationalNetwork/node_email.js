import Node from './base_node.js';
import $ from 'jquery';

class Email extends Node {
  constructor(...args) {
    super(...args);
  }
  genLogo = () => {
    return $('<i class="newIconfont iconapplication"></i>');
  }
}

export default Email;
