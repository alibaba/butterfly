const endpoints = [{
  id: 'right',
  orientation: [1, 0],
  pos: [0, 0.5]
},
{
  id: 'left',
  orientation: [-1, 0],
  pos: [0, 0.5]
}
];

export default {
groups: [{
  id: '1',
  left: 10,
  top: 100,
  render: `<div :style="{width:'250px',textAlign:'center',backgroundColor:'blanchedalmond'}" class='group-style'>测试group</div>`
}],
nodes: [{
    id: '1',
    group: '1',
    endpoints: endpoints,
    render: `<el-button type="primary">节点1</el-button>`
    // 可以用任何Ui库（安装即可）,用element组件要先安装element-ui
  },
  {
    id: '2',
    top: 25,
    left: 300,
    endpoints: endpoints,
    render: `<div>测试节点2</div>`
  },
  {
    id: '3',
    top: 25,
    left: 600,
    endpoints: endpoints,
  }
],
edges: [{
  id: '1.right-2.left',
  sourceNode: '1',
  targetNode: '2',
  source: 'right',
  target: 'left',
  render: '<div>测试label</div>'
}],
};