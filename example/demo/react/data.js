import React from 'react';
import Node from './node.js';
import Label from './label.js';

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

const data = {
  nodes: [
    {
      id: '1',
      endpoints: endpoints,
      left: 0,
      top: 0,
      render() {
        return (
          <Node title="申请人" />
        );
      }
    },
    {
      id: '2',
      endpoints: endpoints,
      left: 400,
      top: 0,
      render() {
        return (
          <Node
            title="审批人"
          />
        );
      }
    },
    {
      id: '3',
      left: 0,
      top: 200,
      endpoints: endpoints,
      render() {
        return <Node title="验收人" />;
      }
    }
  ],
  edges: [
    {
      id: '1-2',
      sourceNode: '1',
      targetNode: '2',
      source: 'right',
      target: 'left',
      shapeType: 'Bezier',
      labelRender() {
        return <Label />;
      }
    }
  ],
};

export default data;
