import Node from './node';
import Edge from './edge';
import CenterNode from './centerNode';

export default {
  nodes: [
    {
      id: 0,
      text: '测试0',
      Class: Node,
      _group: 'group_0',
      _isCircle: true,
    },
    {
      id: 1,
      text: '测试1',
      Class: Node,
      _group: 'group_0',
      _isCircle: true
    },
    {
      id: 3,
      text: '测试2',
      Class: Node,
      _group: 'group_0',
      _isCircle: true
    },
    {
      id: 4,
      text: '测试3',
      Class: Node,
      _group: 'group_0',
      _isCircle: true
    },
    {
      id: 5,
      text: '测试4',
      Class: Node,
      _group: 'group_1',
      _isCircle: true
    },
    {
      id: 6,
      text: '测试5',
      Class: Node,
      _group: 'group_1',
      _isCircle: true
    },
    {
      id: 7,
      text: '测试6',
      Class: Node,
      _group: 'group_1',
      _isCircle: true
    },
    {
      id: 8,
      text: '测试7',
      Class: Node,
      _group: 'group_2',
      _isCircle: true
    },
    {
      id: 9,
      text: '测试8',
      Class: Node,
      _group: 'group_3',
      _isCircle: true
    },
    {
      id: 10,
      text: '测试9',
      Class: Node,
      _group: 'group_3',
      _isCircle: true
    },
    {
      id: 11,
      text: '测试10',
      Class: Node,
      _group: 'group_3',
      _isCircle: true
    },
    {
      id: 12,
      text: '测试11',
      Class: Node,
      _group: 'group_3',
      _isCircle: true
    },
    {
      id: 13,
      text: '测试12',
      Class: Node,
      _group: 'group_4',
      _isCircle: true
    },
    {
      id: 14,
      text: '测试13',
      Class: Node,
      _group: 'group_4',
      _isCircle: true
    },
    {
      id: 15,
      text: '测试14',
      Class: Node,
      _group: 'group_4',
      _isCircle: true
    },
    {
      id: 16,
      text: '测试15',
      Class: Node,
      _group: 'group_4',
      _isCircle: true
    },
    {
      id: 17,
      text: '测试16',
      Class: Node,
      _group: 'group_4',
      _isCircle: true
    },
    {
      id: 18,
      text: '测试17',
      Class: Node,
      _group: 'group_5',
      _isCircle: true
    },
    {
      id: 19,
      text: '测试18',
      Class: Node,
      _group: 'group_5',
      _isCircle: true
    },
    {
      id: 20,
      text: '测试19',
      Class: Node,
      _group: 'group_5',
      _isCircle: true
    },
    {
      id: 21,
      text: '测试20',
      Class: Node,
      _group: 'group_5',
      _isCircle: true
    },
    {
      id: 22,
      text: '测试21',
      Class: Node,
      _group: 'group_5',
      _isCircle: true
    },
    {
      id: 23,
      text: '测试22',
      Class: Node,
      _group: 'group_5',
      _isCircle: true
    },
    {
      id: 24,
      text: '测试23',
      Class: Node,
      _group: 'group_5',
      _isCircle: true
    },
    {
      id: 25,
      text: '测试24',
      Class: Node,
      _group: 'group_5',
      _isCircle: true
    },
    {
      id: 'centerNode',
      text: '城市出行',
      top: -18,
      left: -58,
      Class: CenterNode
    }
  ],
  groups: [
    {
      id: 'group_0',
      color: '#9043B2'
    },
    {
      id: 'group_1',
      color: '#0034D8'
    },
    {
      id: 'group_2',
      color: '#0BABC2'
    },
    {
      id: 'group_3',
      color: '#71D6C3'
    },
    {
      id: 'group_4',
      color: '#EF5229'
    },
    {
      id: 'group_5',
      color: '#B0BE22'
    }
  ],
  edges: [
    {
      id: 1,
      source: 'centerNode',
      target: 11,
      Class: Edge
    },
    {
      id: 2,
      source: 'centerNode',
      target: 1,
      Class: Edge
    }
  ],
  notes: [
    {
      id: 0,
      _group: 'group_0',
      text: '这是group0的注释'
    },
    {
      id: 1,
      _group: 'group_1',
      text: '这是group1的注释'
    },
    {
      id: 2,
      _group: 'group_2',
      text: '这是group2的注释'
    },
    {
      id: 3,
      _group: 'group_3',
      text: '这是group3的注释'
    },
    {
      id: 4,
      _group: 'group_4',
      text: '这是group4的注释'
    },
    {
      id: 5,
      _group: 'group_5',
      text: '这是group5的注释'
    }
  ]
};
