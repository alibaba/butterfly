const {graphvizLayout} = require('../../index');
const treeData = require('./mock_data.json');

module.exports = graphvizLayout(treeData);
