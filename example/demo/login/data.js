import Node from './node';
import Edge from './edge';

export default {
  nodes: [
    {
      id: '1',
      label: '扫码',
      className: 'circle-border',
      iconType: 'icon-rds',
      top: 300,
      left: 50,
      Class: Node,
      endpoints: [{
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '2',
      label: '登录/注册',
      className: 'circle-border',
      circleType: 'border',
      top: 300,
      left: 200,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }, {
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '3',
      label: '登录账户',
      className: 'circle-border',
      circleType: 'border',
      top: 150,
      left: 350,
      Class: Node,
      endpoints: [{
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '4',
      label: '创建账户',
      className: 'circle-border',
      circleType: 'border',
      top: 450,
      left: 350,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }]
    },
    {
      id: '5',
      label: '继续',
      className: 'circle-border',
      iconType: 'icon-bofang',
      top: 300,
      left: 500,
      Class: Node,
      endpoints: [{
        id: 'top',
        orientation: [0, -1],
        pos: [0.5, 0]
      }, {
        id: 'bottom',
        orientation: [0, 1],
        pos: [0.5, 0]
      }, {
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '6',
      label: '兑换',
      className: 'circle-border',
      iconType: 'icon-naswenjiancunchuNAS',
      top: 300,
      left: 650,
      Class: Node,
      endpoints: [{
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }, {
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '7',
      label: '启动',
      label2: 'XMind2020',
      className: 'circle-border',
      circleType: 'border',
      top: 150,
      left: 800,
      Class: Node,
      endpoints: [{
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }, {
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '8',
      label: '帮助-登录',
      className: 'circle-border',
      circleType: 'border',
      top: 150,
      left: 950,
      Class: Node,
      endpoints: [{
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }, {
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '9',
      label: '启动',
      label2: 'XMind移动版',
      className: 'circle-border',
      circleType: 'border',
      top: 450,
      left: 800,
      Class: Node,
      endpoints: [{
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }, {
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '10',
      label: '设置-登录',
      className: 'circle-border',
      circleType: 'border',
      top: 450,
      left: 950,
      Class: Node,
      endpoints: [{
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      }, {
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }]
    },
    {
      id: '11',
      label: '解锁完整版',
      className: 'circle-border',
      iconType: 'icon-xianshang',
      top: 300,
      left: 1100,
      Class: Node,
      endpoints: [{
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      }]
    },
  ],
  edges: [{
    source: 'right',
    target: 'left',
    sourceNode: '1',
    targetNode: '2',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: Edge
  }, {
    source: 'top',
    target: 'bottom',
    sourceNode: '2',
    targetNode: '3',
    type: 'endpoint',
    arrow: true,
    label: '有账户',
    arrowPosition: 0.5,
    Class: Edge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '2',
    targetNode: '4',
    type: 'endpoint',
    arrow: true,
    label: '无账户',
    arrowPosition: 0.5,
    Class: Edge
  }, {
    source: 'bottom',
    target: 'top',
    sourceNode: '3',
    targetNode: '5',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: Edge
  }, {
    source: 'top',
    target: 'bottom',
    sourceNode: '4',
    targetNode: '5',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: Edge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: '5',
    targetNode: '6',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: Edge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: '6',
    targetNode: '7',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: Edge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: '7',
    targetNode: '8',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: Edge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: '6',
    targetNode: '9',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: Edge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: '9',
    targetNode: '10',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: Edge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: '8',
    targetNode: '11',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: Edge
  }, {
    source: 'right',
    target: 'left',
    sourceNode: '10',
    targetNode: '11',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    Class: Edge
  }],
};

