import React from 'react';
import Node from '../components/node';
import Toolbar from '../components/tool-bar';
import ButterflyReact, {Endpoint} from '../../index';

const data = {
  nodes: [
    {
      id: '1',
      render() {
        return (
          <Node title="节点1">
            <Endpoint id="endpoint-1">
              锚点1
            </Endpoint>
          </Node>
        );
      }
    },
    {
      id: '2',
      render() {
        return (
          <Node title="节点2">
            <Endpoint id="endpoint-2">
              锚点2
            </Endpoint>
          </Node>
        );
      }
    }
  ],
  edges: [
    {
      id: '1-2',
      sourceNode: '1',
      targetNode: '2',
      source: 'endpoint-1',
      target: 'endpoint-2'
    }
  ]
};

const EndpointDemo = () => {
  return (
    <div className="basic-demo">
      <Toolbar />
      <ButterflyReact {...data} />
    </div>
  );
};

export default EndpointDemo;
