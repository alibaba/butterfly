import BaseNode from './BaseNode.vue';
export const endpoints = [
  {
    id: 'left',
    orientation: [-1, 0],
    pos: [0, 0.5]
  },
  {
    id: 'bottom',
    orientation: [0, 1],
    pos: [0.45, 0]
  }
];

const mockData = {
  nodes: {
    id: '0',
    isRoot: true,
    condition: 'all',
    title: '企业经营异常记录数',
    desc: '',
    render: BaseNode,
    endpoints: endpoints,
    children: [
      {
        id: '01',
        parentId: '0',
        condition: 'and',
        render: BaseNode,
        title: '近X个月X万元交易次数',
        desc: `请选择指标`,
        endpoints,
        children: [
          {
            id: '0101',
            condition: 'and',
            render: BaseNode,
            title: '商户状态',
            desc: `请选择指标`,
            endpoints,
          },
        ],
      },
      {
        id: '02',
        parentId: '0',
        condition: 'and',
        render: BaseNode,
        title: '商户状态',
        desc: `请选择指标`,
        endpoints,
        children: [
          {
            id: '0201',
            condition: 'and',
            render: BaseNode,
            title: '近X个月X万元交易次数',
            desc: `请选择指标`,
            endpoints,
          },
        ],
      },
    ],
  },
  edges: [
    {
      id: 'e0',
      source: 'bottom',
      target: 'left',
      sourceNode: '0',
      targetNode: '01',
      type: 'endpoint',
    },
    {
      id: 'e1',
      source: 'bottom',
      target: 'left',
      sourceNode: '0',
      targetNode: '02',
      type: 'endpoint',
    },
    {
      id: 'e2',
      source: 'bottom',
      target: 'left',
      sourceNode: '01',
      targetNode: '0101',
      type: 'endpoint',
    },
    {
      id: 'e3',
      source: 'bottom',
      target: 'left',
      sourceNode: '02',
      targetNode: '0201',
      type: 'endpoint',
    },
  ],
};
export default mockData;
