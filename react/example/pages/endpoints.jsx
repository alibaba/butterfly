import React, {useState} from 'react';
import Node from '../components/node';
import Toolbar from '../components/tool-bar';
import ButterflyReact, {Endpoint} from '../../index';

const initialValue = {
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
  const [data, setData] = useState(initialValue);

  const onAddNode = () => {
    const id = String(data.nodes.length + 2);
    data.nodes.push({
      id: id,
      render() {
        return (
          <Node title="节点">
            <Endpoint id={`endpoint-${id}`}>
              锚点{id}
            </Endpoint>
          </Node>
        );
      }
    });

    data.nodes = [...data.nodes];

    setData({...data});
  };

  const onAddEdge = () => {
    const leftNodeId = parseInt((Math.random() * data.nodes.length), 10);
    const rightNodeId = parseInt((Math.random() * data.nodes.length), 10);

    if (rightNodeId === leftNodeId) {
      return;
    }

    data.edges.push({
      id: `${leftNodeId}-${rightNodeId}-${data.edges.length}`,
      sourceNode: String(leftNodeId),
      targetNode: String(rightNodeId),
      source: `endpoint-${leftNodeId}`,
      target: `endpoint-${rightNodeId}`
    });

    data.edges = [...data.edges];

    setData({...data});
  };

  const onSwitchData = () => {
    data.nodes.push({
      id: '100',
      render() {
        return (
          <Node title="节点">
            <Endpoint id={`endpoint-100`}>
              锚点100
            </Endpoint>
          </Node>
        );
      }
    });

    data.edges.push({
      id: '1-100',
      sourceNode: '1',
      targetNode: '100',
      source: 'endpoint-1',
      target: 'endpoint-100'
    });

    data.edges.push({
      id: '2-100',
      sourceNode: '2',
      targetNode: '100',
      source: 'endpoint-2',
      target: 'endpoint-100'
    });

    setData({
      nodes: [...data.nodes],
      edges: [...data.edges]
    });
  };

  return (
    <div className="basic-demo">
      <Toolbar
        onAddNode={onAddNode}
        onAddEdge={onAddEdge}
        onSwitchData={onSwitchData}
      />
      <ButterflyReact {...data} />
    </div>
  );
};

export default EndpointDemo;
