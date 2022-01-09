import React, {useEffect} from 'react';
import _debug from 'debug';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Context from '../context';
import BfNode from '../coms/node';
import checkRender from '../util/check-render.js';

const debug = _debug('butterflf-react');

const noop = () => null;

const NodeRender = (props) => {
  const {nodes, idPrefix, canvas, onRenderFinish = noop} = props;
  const endpoints = [];

  if (!Array.isArray(nodes)) {
    return null;
  }

  // ============== Set React Endpoint To Canvas ==============
  useEffect(() => {
    if (!canvas) {
      return;
    }

    // 如果用户已经使用endpoints代替自定义node
    // 此时不需要渲染React Endpoint
    const isUserCfgEndpoint = (nodeId) => {
      const userDefNode = nodes.find(n => n.id === nodeId);
      return !!userDefNode?.endpoints;
    };

    // 添加节点
    endpoints.forEach((endpoint) => {
      const {nodeId, endpointId} = endpoint;

      if (isUserCfgEndpoint(nodeId)) {
        return;
      }

      if (!canvas || !nodeId) {
        return;
      }

      const node = canvas.getNode(nodeId);

      if (!node) {
        return;
      }

      debug(`add endpoint ${endpointId} to ${node.id} successfully`);

      if (node.endpoints.some(endpoint => endpoint.id === endpointId)) {
        return;
      }

      node.addEndpoint({
        ...endpoint,
        id: endpointId,
        dom: document.getElementById(endpointId),
      });
    });

    // 移除多余锚点
    canvas.nodes.forEach(node => {
      const nodeId = node.id;
      if (isUserCfgEndpoint(nodeId)) {
        return;
      }

      const nodeEndpoints = endpoints.filter(endpoint => {
        return endpoint.nodeId === nodeId;
      });

      node.endpoints.forEach((endpoint) => {
        const nodeEndpointIds = nodeEndpoints.map(e => e.endpointId);
        if (!nodeEndpointIds.includes(endpoint.id)) {
          debug(`remove endpoint ${endpoint.id} from ${node.id} successfully`);
          node.removeEndpoint(endpoint.id);
        }
      });
    });

    // 存量的锚点需要重新获取 dom，因为dom被移除，可能导致锚点失效
    canvas.nodes.forEach(node => {
      if (isUserCfgEndpoint(node.id)) {
        return;
      }

      node.endpoints.forEach(endpoint => {
        const dom = document.getElementById(endpoint.id);

        if (!dom) {
          node.removeEndpoint(endpoint.id);
        }

        endpoint.dom = dom;
      });
    });

    onRenderFinish();
  });

  const elements = nodes.map(item => {
    const id = item.id;

    if (!id) {
      // eslint-disable-next-line
      console.warn(`node ${id} 不含有ID属性，请检查格式`);

      return null;
    }

    const dom = document.getElementById(idPrefix + item.id);

    if (!dom) {
      return null;
    }

    checkRender(item.render, 'node');
    const hasRender = !!item.render;
    const element = hasRender ? item.render(item) : <BfNode key={id} {...item} />;

    return ReactDOM.createPortal(element, dom);
  });

  return (
    <Context.Provider
      value={{
        gather: ({id, nodeId, ...rest}) => {
          endpoints.push({
            endpointId: id,
            nodeId,
            ...rest,
          });
        }
      }}
    >
      {elements}
    </Context.Provider>
  );
};

NodeRender.propTypes = {
  canvas: PropTypes.object,             // 小蝴蝶实例
  nodes: PropTypes.array,
  idPrefix: PropTypes.string,
  onRenderFinish: PropTypes.func       // 节点以及锚点是否全部渲染完毕
};

export default NodeRender;
