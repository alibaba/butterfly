import React from 'react';

import Node from '../components/node';
import ButterflyReact from '../../index';
import Toolbar from '../components/tool-bar';

import './basic.less';

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
      render() {
        return <Node title="测试节点1" />;
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
      top: 25,
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

const Basic = () => {
  return (
    <div className="basic-demo">
      <Toolbar />
      <ButterflyReact {...data} />
    </div>
  );
};

export default Basic;
