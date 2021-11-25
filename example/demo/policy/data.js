import Node from './node';
import Edge from './edge';

export default {
  nodes: [
    {
      id: '1',
      label: '开始',
      className: 'icon-background-color',
      iconType: 'icon-bofang',
      top: 50,
      left: 63,
      Class: Node
    },
    {
      id: '2',
      label: '默认通过',
      className: 'icon-background-color',
      iconType: 'icon-rds',
      top: 150,
      left: 50,
      Class: Node
    },
    {
      id: '3',
      label: '政策监管准入',
      className: 'icon-background-color',
      iconType: 'icon-guize-kai',
      top: 250,
      left: 36,
      Class: Node,
      endpoints: [
        {
          id: 'right',
          orientation: [1, 0],
          pos: [0, 0.5]
        }
      ]
    },
    {
      id: '4',
      label: '条件分支',
      className: 'icon-background-color',
      iconType: 'icon-slbfuzaijunhengSLB',
      top: 250,
      left: 250,
      Class: Node,
      endpoints: [
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
      ]
    },
    {
      id: '5',
      label: '行内准入',
      className: 'icon-background-color',
      iconType: 'icon-guize-kai',
      top: 180,
      left: 400,
      Class: Node,
      endpoints: [
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
      ]
    },
    {
      id: '6',
      label: '拒绝',
      className: 'icon-background-color',
      iconType: 'icon-rds',
      top: 330,
      left: 400,
      Class: Node,
      endpoints: [
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
      ]
    },
    {
      id: '7',
      label: '结束',
      className: 'icon-background-color',
      iconType: 'icon-tingzhi',
      top: 330,
      left: 550,
      Class: Node,
      endpoints: [
        {
          id: 'left',
          orientation: [-1, 0],
          pos: [0, 0.5]
        }
      ]
    },
    {
      id: '8',
      label: '企业资质评分卡',
      className: 'icon-background-color',
      iconType: 'icon-rds',
      top: 180,
      left: 750,
      Class: Node,
      endpoints: [
        {
          id: 'left',
          orientation: [-1, 0],
          pos: [0, 0.5]
        }
      ]
    },
    {
      id: '9',
      label: '企业评分卡等级',
      className: 'icon-background-color',
      iconType: 'icon-ossduixiangcunchuOSS',
      top: 270,
      left: 750,
      Class: Node
    },
    {
      id: '10',
      label: '条件分支',
      className: 'icon-background-color',
      iconType: 'icon-slbfuzaijunhengSLB',
      top: 360,
      left: 771,
      Class: Node,
    },
    {
      id: '11',
      label: 'E档拒绝',
      className: 'icon-background-color',
      iconType: 'icon-rds',
      top: 460,
      left: 700,
      Class: Node
    },
    {
      id: '12',
      label: '结束',
      className: 'icon-background-color',
      iconType: 'icon-tingzhi',
      top: 540,
      left: 710,
      Class: Node
    },
    {
      id: '13',
      label: '企业信用额度',
      className: 'icon-background-color',
      iconType: 'icon-shujuji',
      top: 460,
      left: 850,
      Class: Node,
    },
    {
      id: '14',
      label: '回落脚本',
      className: 'icon-background-color',
      iconType: 'icon-edit',
      top: 540,
      left: 864,
      Class: Node
    },
    {
      id: '15',
      label: '赋值通过',
      className: 'icon-background-color',
      iconType: 'icon-rds',
      top: 620,
      left: 864,
      Class: Node
    },
    {
      id: '16',
      label: '结束',
      className: 'icon-background-color',
      iconType: 'icon-bofang',
      top: 700,
      left: 877,
      Class: Node
    },
  ],
  edges: [
    {
      source: '1',
      target: '2',
      sourceNode: '1',
      targetNode: '2',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: '2',
      target: '3',
      sourceNode: '2',
      targetNode: '3',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'right',
      target: 'left',
      sourceNode: '3',
      targetNode: '4',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'right',
      target: 'left',
      sourceNode: '4',
      targetNode: '5',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'right',
      target: 'left',
      sourceNode: '4',
      targetNode: '6',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'right',
      target: 'left',
      sourceNode: '6',
      targetNode: '7',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: 'right',
      target: 'left',
      sourceNode: '5',
      targetNode: '8',
      type: 'endpoint',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: '8',
      target: '9',
      sourceNode: '8',
      targetNode: '9',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: '9',
      target: '10',
      sourceNode: '9',
      targetNode: '10',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: '10',
      target: '11',
      sourceNode: '10',
      targetNode: '11',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: '11',
      target: '12',
      sourceNode: '11',
      targetNode: '12',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: '10',
      target: '13',
      sourceNode: '10',
      targetNode: '13',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: '13',
      target: '14',
      sourceNode: '13',
      targetNode: '14',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: '14',
      target: '15',
      sourceNode: '14',
      targetNode: '15',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
    {
      source: '15',
      target: '16',
      sourceNode: '15',
      targetNode: '16',
      arrow: true,
      arrowPosition: 0.5,
      Class: Edge
    },
  ]
};

