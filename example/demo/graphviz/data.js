'use strict';

const {graphvizLayout} = require('butterfly-plugins-layout');
const treeData = require('./long_data.json');

module.exports = graphvizLayout(treeData);
