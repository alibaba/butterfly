'use strict';

const BaseNode = require('./node.js');
const AlisBaseNode = require('./alis-node.js');
const $ = require('jquery');

module.exports = {
  nodes: [{
    id: '0',
    name: 'Book',
    top: 264,
    left: 172,
    data: {
      content: ['id', 'isbn', 'title']
    },
    endpoints: [{
      id: 'point_1',
      type: 'source',
      orientation: [1, 0],
      pos: [0, 1.5]

    }, {
      id: 'point_2',
      type: 'target',
      orientation: [-1, 0],
      pos: [0, 1.5]
    }],
    Class: BaseNode
  }, {
    id: '1',
    name: 'BookPublisher',
    top: 488,
    left: 374,
    data: {
      content: ['book_id', 'publisher_id']
    },
    endpoints: [{
      id: 'point_1',
      type: 'target',
      orientation: [-1, 0],
      pos: [0, 1.5]
    }, {
      id: 'point_2',
      type: 'source',
      orientation: [1, 0],
      pos: [0, 2.5]
    }],
    Class: BaseNode
  }, {
    id: '2',
    name: 'Author',
    top: 488,
    left: 750,
    data: {
      content: ['id', 'name']
    },
    endpoints: [{
      id: 'point_1',
      type: 'target',
      orientation: [-1, 0],
      pos: [0, 1.5]
    }],
    Class: BaseNode
  }, {
    id: '3',
    name: 'BookAuthor',
    top: 754,
    left: -36,
    data: {
      content: ['book_id', 'author_id']
    },
    endpoints: [{
      id: 'point_1',
      type: 'source',
      orientation: [1, 0],
      pos: [0, 1.5]
    }, {
      id: 'point_2',
      type: 'source',
      orientation: [1, 0],
      pos: [0, 2.5]
    }],
    Class: BaseNode
  }, {
    id: '4',
    name: 'Publisher',
    data: {
      content: ['id', 'name']
    },
    top: 754,
    left: 374,
    endpoints: [{
      id: 'point_1',
      type: 'target',
      orientation: [-1, 0],
      pos: [0, 1.5]
    }],
    Class: BaseNode
  }, {
    id: '5',
    name: 'Books By Author',
    data: {
      content: 'SELECT * FROM b INNER JOIN book_author ba ON b.id = ba.book_id GROUP BY ba.author_id'
    },
    top: 744,
    left: 900,
    Class: AlisBaseNode
  }],
  edges: [{
    source: 'point_1',
    target: 'point_1',
    sourceNode: '0',
    targetNode: '1',
    type: 'endpoint',
  }, {
    source: 'point_2',
    target: 'point_1',
    sourceNode: '1',
    targetNode: '4',
    type: 'endpoint',
  }, {
    source: 'point_1',
    target: 'point_2',
    sourceNode: '3',
    targetNode: '0',
    type: 'endpoint',
  }, {
    source: 'point_2',
    target: 'point_1',
    sourceNode: '3',
    targetNode: '2',
    type: 'endpoint',
  }],
};