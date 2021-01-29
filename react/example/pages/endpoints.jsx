import React, {useState, useRef, useEffect} from 'react';
import _ from 'lodash';

import Node from '../components/node';
import Toolbar from '../components/tool-bar';
import ButterflyReact, {Endpoint} from '../../index';

const options = {
  layout: {
    type: 'drageLayout',
    options: {
      rankdir: 'TB',
      nodesep: 100,
      ranksep: 100,
      controlPoints: false,
    },
  }
};

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
            <div style={{position: 'absolute', right: 0, bottom: 0}}>
              <Endpoint id="endpoint-3">
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

const switchData = _.cloneDeep(initialValue);

switchData.nodes.push({
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

switchData.edges.push({
  id: '1-100',
  sourceNode: '1',
  targetNode: '100',
  source: 'endpoint-1',
  target: 'endpoint-100'
});

switchData.edges.push({
  id: '2-100',
  sourceNode: '2',
  targetNode: '100',
  source: 'endpoint-2',
  target: 'endpoint-100'
});


const EndpointDemo = () => {
  const canvasRef = useRef();
  const [data, setData] = useState(initialValue);


  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    // 当需要自动重新布局时调用此方法，可实现在添加节点之后重新布局的功能
    canvasRef.current.relayout();
  }, [data.nodes.length]);

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
    if (data === switchData) {
      setData(initialValue);
    } else {
      setData(switchData);
    }
  };

  return (
    <div className="basic-demo">
      <Toolbar
        onAddNode={onAddNode}
        onAddEdge={onAddEdge}
        onSwitchData={onSwitchData}
      />
      <ButterflyReact
        options={options}
        onLoaded={(canvas) => {
          canvasRef.current = canvas;
        }}
        {...data}
      />
    </div>
  );
};

export default EndpointDemo;
