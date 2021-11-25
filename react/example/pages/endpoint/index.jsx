import React, {useState, useRef, useEffect} from 'react';

import Node from '../../components/node';
import Toolbar from '../../components/tool-bar';
import {initialValue, switchData} from './mock-data';
import ButterflyReact, {Endpoint} from '../../../index';

import '../color.less';

const options = {
  layout: {
    type: 'dagreLayout',
    options: {
      rankdir: 'TB',
      nodesep: 100,
      ranksep: 100,
      controlPoints: false,
    },
  }
};

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
            <Endpoint
              id={`endpoint-${id}`}
              nodeId={id}
            >
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

  const onSwitchColor = (color) => {
    data.edges.forEach(edge => {
      edge.className = color;
    });

    data.edges = [...data.edges];

    setData({...data});
  };

  return (
    <div className="basic-demo">
      <Toolbar
        onAddNode={onAddNode}
        onAddEdge={onAddEdge}
        onSwitchData={onSwitchData}
        onSwitchColor={onSwitchColor}
      />
      <ButterflyReact
        options={options}
        onLoaded={(canvas) => {
          canvasRef.current = canvas;
        }}
        onEachFrame={() => {
          console.log('render frame finish');
        }}
        {...data}
      />
    </div>
  );
};

export default EndpointDemo;
