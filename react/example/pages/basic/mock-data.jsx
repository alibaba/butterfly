import React from 'react';
import Node from '../../components/node';

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

export const data = {
  nodes: [
    {
      id: '1',
      top: 100,
      endpoints: endpoints,
      isHighlight1: false,
      render(item) {
        return <Node title="测试节点1" item={item} />;
      }
    },
    {
      id: '2',
      top: 25,
      left: 300,
      endpoints: endpoints,
      render() {
        return <Node title="测试节点2" />;
      }
    },
    {
      id: '3',
      top: 250,
      left: 300,
      endpoints: endpoints,
      render() {
        return <Node title="测试节点3" />;
      }
    }
  ],
  edges: [
    {
      id: '1-2',
      sourceNode: '1',
      targetNode: '2',
      className: 'red',
      arrowClassName: 'red',
      source: 'right',
      target: 'left',
      labelRender: () => {
        return '测试label';
      }
    },
    {
      id: '1-3',
      sourceNode: '1',
      targetNode: '3',
      source: 'right',
      target: 'left',
      labelRender: () => {
        return '测试label';
      }
    }
  ],
};
