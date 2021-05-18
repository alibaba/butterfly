import baseNode from './node/base-node.vue';
import baseGroup from './group/base-group.vue';
import baseLabel from './edgeLabel/base-label.vue';

const endpoints = [
  {
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
  groups: [
    // 默认模式
    {
      id: '1',
      left: 10,
      top: 20,
    },
    // template模式
    {
      id: '2',
      left: 300,
      top: 20,
      render: `<div :style="{width:'250px',height:'150px',textAlign:'center',backgroundColor:'blanchedalmond'}" class='group-style'>测试group</div>`
    },
    // .vue文件模式
    {
      id: '3',
      left: 590,
      top: 20,
      userData: {
        name: '自定义group名字'
      },
      render: baseGroup
    }
  ],
  nodes: [
    {
      id: '1',
      group: '1',
      top: 40,
      left: 20,
      endpoints: endpoints,
    },
    {
      id: '2',
      group: '2',
      top: 40,
      left: 20,
      endpoints: endpoints,
      render: baseNode
    },
    {
      id: '3',
      group: '3',
      top: 40,
      left: 50,
      endpoints: endpoints,
      render: `<div>测试节点3</div>`
    },
    {
      id: '4',
      top: 200,
      left: 390,
      endpoints: endpoints,
      render: `<el-button type="primary">节点4</el-button>`
      // 可以用任何Ui库（安装即可）,用element组件要先安装element-ui
    }
  ],
  edges: [
    {
      id: '1.right-2.left',
      sourceNode: '1',
      targetNode: '2',
      source: 'right',
      target: 'left',
      render: baseLabel
    },
    {
      id: '2.right-3.left',
      sourceNode: '2',
      targetNode: '3',
      source: 'right',
      target: 'left',
      render: '<div>测试label</div>'
    },
  ],
};
