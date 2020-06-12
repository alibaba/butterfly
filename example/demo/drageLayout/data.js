'use strict';
const Train = require('./node_train.jsx');

module.exports = {
  nodes: [{
    id: 'test1',
    name: '王大萌',
    type: 'people',
    Class: Train,
    color: '#19A97B'
  }, {
    id: 'test2',
    name: 'K1239',
    type: 'train',
    Class: Train,
    color: '#436EEE'
  }, {
    id: 'test3',
    name: '5144xxxxxx@qq.com',
    type: 'email',
    Class: Train,
    color: '#7A67EE'
  },{
    id: 'test4',
    name: '12',
    type: 'email',
    Class: Train,
    color: '#7A67EE'
  }
],
  edges: [{
    source: 'test1',
    target: 'test2',
  }, {
    source: 'test1',
    target: 'test3'
  }, {
    source: 'test1',
    target: 'test4'
  }]
};
