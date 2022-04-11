import React from 'react';
import _ from 'lodash';

import {Endpoint} from '../../../index';
import Node from '../../components/node';

export const initialValue = {
  nodes: [
    {
      id: '1',
      render() {
        return (
          <Node title="节点1">
            <Endpoint
              id="endpoint-1"
              nodeId="1"
              className="red-endpoint"
            >
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
            <Endpoint
              id="endpoint-2"
              nodeId="2"
            >
              锚点2
            </Endpoint>
            <div style={{position: 'absolute', right: 0, bottom: 0}}>
              <Endpoint
                id="endpoint-3"
                nodeId="2"
              >
                内部锚点
              </Endpoint>
            </div>
          </Node>
        );
      }
    },
    {
      id: '3',
      render() {
        return (
          <Node title="节点3">
            节点3
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
      className: 'red',
      arrowClassName: 'red',
      source: 'endpoint-1',
      target: 'endpoint-2'
    },
    {
      id: '1-3',
      sourceNode: '1',
      targetNode: '2',
      source: 'endpoint-1',
      target: 'endpoint-3'
    }
  ]
};

export const switchData = _.cloneDeep(initialValue);

switchData.nodes[1].render = function render() {
  return (
    <Node title="节点2">
      <Endpoint
        id="endpoint-2"
        nodeId="2"
      >
        锚点2
      </Endpoint>
      <Endpoint
        id="endpoint-4"
        nodeId="2"
      >
        锚点4
      </Endpoint>
      <Endpoint
        id="endpoint-5"
        nodeId="2"
      >
        锚点5
      </Endpoint>
      <Endpoint
        id="endpoint-6"
        nodeId="2"
      >
        锚点6
      </Endpoint>
      <div style={{position: 'absolute', right: 0, bottom: 0}}>
        <Endpoint
          id="endpoint-3"
          nodeId="2"
        >
          锚点3
        </Endpoint>
      </div>
    </Node>
  );
};

switchData.nodes.push({
  id: '100',
  render() {
    return (
      <Node title="节点">
        <Endpoint
          id={`endpoint-100`}
          nodeId="100"
        >
          锚点100
        </Endpoint>
      </Node>
    );
  }
});

switchData.edges.push({
  id: '1-100',
  sourceNode: '1',
  targetNode: '100',
  source: 'endpoint-1',
  target: 'endpoint-100'
});

[4, 5, 6].forEach(key => {
  switchData.edges.push({
    id: `1-2-${key}`,
    sourceNode: '1',
    targetNode: '2',
    className: 'blue',
    source: 'endpoint-1',
    target: `endpoint-${key}`
  });
});

switchData.edges.push({
  id: '2-100',
  sourceNode: '2',
  targetNode: '100',
  source: 'endpoint-2',
  target: 'endpoint-100'
});

switchData.edges[0].className = 'blue';
