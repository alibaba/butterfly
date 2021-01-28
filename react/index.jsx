import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {Canvas} from 'butterfly-dag';

import diff from './util/diff.js';
import recalc from './util/re-calc.js';
import CEndpoint from './coms/endpoint';
import process from './util/process.js';
import relayout from './util/re-layout.js';
import NodeRender from './coms/node-render.jsx';
import CommonRender from './coms/common-render.jsx';
import defaultOptions from './util/default-options';

import 'butterfly-dag/dist/index.css';
import './index.less';

const noop = () => null;
window._ = _;

const call = (fn) => {
  if (!fn) {
    return noop;
  }

  if (typeof fn !== 'function') {
    return noop;
  }

  return fn;
};

const ReactButterfly = (props) => {
  const {
    options = {}, onDeleteEdge,
    onEdgesChange, className, groups,
    onCreateEdge, nodes, edges,
    onLoaded = noop
  } = props;

  // 触发画布更新
  const [currentStep, setStep] = useState(0);
  const containerRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    // 利用ID，和当前的边，当前的节点进行对比
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const oldNodes = canvas.nodes;
    const oldEdges = canvas.edges;
    const oldGroups = canvas.groups;

    const processNodes = () => {
      const {created, deleted} = diff(nodes, oldNodes);

      canvas.addNodes(process({nodes: created}).nodes);
      canvas.removeNodes(process({nodes: deleted}).nodes);
    };

    const processEdge = () => {
      const {created, deleted} = diff(edges, oldEdges);


      canvas.addEdges(process({edges: created}).edges, true);
      canvas.removeEdges(process({edges: deleted}).edges.map(e => e.id));
    };

    const processGroups = () => {
      const {created, deleted} = diff(groups, oldGroups);

      process({groups: created}).groups.forEach(group => {
        canvas.addGroup(group);
      });

      process({groups: deleted}).groups.forEach(group => {
        canvas.removeGroup(group.id);
      });
    };

    processGroups();
    processNodes();
    setTimeout(() => {
      processEdge();
    });

    setStep(currentStep + 1);
  }, [nodes, edges, groups]);

  useEffect(() => {
    // 重新计算节点和边的位置
    if (currentStep !== 1) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    recalc(canvas);
    relayout(canvas);

    // 此时画布初始化完毕，所有节点渲染OK
    onLoaded(canvas);
  }, [currentStep]);

  useEffect(() => {
    (async () => {
      const dom = containerRef.current;

      if (!dom) {
        // eslint-disable-next-line
        console.warn('当前canvas没有绑定dom节点，无法渲染');
        return;
      }

      const mOptions = {
        ...defaultOptions,
        ...options,
        root: dom,
      };

      const canvas = canvasRef.current = new Canvas(mOptions);

      const data = process({
        nodes,
        edges,
        groups
      });

      await new Promise((res, rej) => {
        try {
          // 优先画节点
          canvas.draw({
            nodes: data.nodes,
            groups: data.groups
          }, () => {
            res();

            setTimeout(() => {
              canvas.addEdges(data.edges);
            });
          });
        } catch (e) {
          rej(e);
        }
      });

      setStep(1);
    })().catch(e => {
      // eslint-disable-next-line no-console
      console.error(e);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.on('system.link.connect', ({links}) => {
      const link = links[0];
      if (!link) {
        return;
      }

      // 直接取消当前连线，然后重新绘制一条
      const {
        sourceNode,
        sourceEndpoint,
        targetNode,
        targetEndpoint
      } = link;

      const sourceNodeId = sourceNode.id;
      const sourceEndpointId = sourceEndpoint.id;
      const targetNodeId = targetNode.id;
      const targetEndpointId = targetEndpoint.id;

      call(onCreateEdge)({
        sourceNodeId,
        sourceEndpointId,
        targetNodeId,
        targetEndpointId
      });

      call(onEdgesChange)(canvas.edges);
    });

    canvas.on('system.link.delete', ({links}) => {
      const link = links[0];
      // 直接取消当前连线，然后重新绘制一条
      const {
        sourceNode,
        sourceEndpoint,
        targetNode,
        targetEndpoint
      } = link;

      const sourceNodeId = sourceNode.id;
      const sourceEndpointId = sourceEndpoint.id;
      const targetNodeId = targetNode.id;
      const targetEndpointId = targetEndpoint.id;

      call(onDeleteEdge)({
        sourceNodeId,
        sourceEndpointId,
        targetNodeId,
        targetEndpointId
      });

      call(onEdgesChange)(canvas.edges);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    recalc(canvas);
  }, [currentStep]);

  return (
    <div
      className={`${className || ''} butterfly-react`}
    >
      <NodeRender
        nodes={nodes}
        idPrefix="bf_node_"
        canvas={canvasRef.current}
      />
      <CommonRender
        data={edges}
        renderKey="labelRender"
        idPrefix="edge_label_"
        type="edge"
      />
      <CommonRender
        data={groups}
        type="group"
        idPrefix="bf_group_"
      />
      <div
        className="butterfly-react-container"
        ref={(ref) => containerRef.current = ref}
      />
    </div>
  );
};


ReactButterfly.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      render: PropTypes.func,           // 渲染函数
      left: PropTypes.number,
      top: PropTypes.number,
      draggable: PropTypes.boolean
    })
  ),
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      labelRender: PropTypes.func       // label渲染函数
    })
  ),
  groups: PropTypes.array,              // 组的数据
  options: PropTypes.shape({            // 画布属性
    layout: PropTypes.func,
    zoomable: PropTypes.func,
    moveable: PropTypes.bool,
    draggable: PropTypes.bool,
    linkable: PropTypes.bool,
    disLinkable: PropTypes.bool,
    theme: PropTypes.object,
    global: PropTypes.object
  }),
  onEdgesChange: PropTypes.func,
  onCreateEdge: PropTypes.func,
  onDeleteEdge: PropTypes.func,
  className: PropTypes.string,
  onLoaded: PropTypes.func,
};


export const Endpoint = CEndpoint;
export default ReactButterfly;
