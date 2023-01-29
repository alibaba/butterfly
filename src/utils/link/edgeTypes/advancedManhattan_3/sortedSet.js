'use strict';

import _ from 'lodash';

const sortedIndex = _.sortedIndexBy || _.sortedIndex;

export default class SortedSet {
  constructor() {
    this.items = [];
    this.hash = {};
    this.values = {};
    this.OPEN = 1;
    this.CLOSE = 2;
  }
  add(item, value) {
    if (this.hash[item]) {
      // item removal
      this.items.splice(this.items.indexOf(item), 1);
    } else {
        this.hash[item] = this.OPEN;
    }

    this.values[item] = value;

    var index = sortedIndex(this.items, item, function(i) {
        return this.values[i];
    }.bind(this));

    this.items.splice(index, 0, item);
  }
  remove(item) {
    this.hash[item] = this.CLOSE;
  }
  isOpen(item) {
    return this.hash[item] === this.CLOSE;
  }
  isClose(item) {
    return this.hash[item] === this.CLOSE;
  }
  isEmpty() {
    return this.items.length === 0;
  }
  pop() {
    var item = this.items.shift();
    this.remove(item);
    return item;
  }
}