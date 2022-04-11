'use strict';

const EventEmit3 = require('eventemitter3');

class Endpoint extends EventEmit3 {
  constructor() {
    super();
  }
}

export default Endpoint;