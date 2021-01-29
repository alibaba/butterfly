import React, {useEffect} from 'react';
import _ from 'lodash';
import _debug from 'debug';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import BfNode from '../coms/node';
import checkRender from '../util/check-render.js';

const debug = _debug('butterflf-react');

const deepWalk = function deepWalk(element) {
  const childElements = [];

  const walk = function walk(ele) {
    let PreElement = ele;
    let children = _.get(PreElement, 'props.children');
    if (!PreElement) {
      return;
    }

    // FIXME: is there a better way？
    if (typeof PreElement.type === 'function' && !PreElement.props.children) {
      try {
        // eslint-disable-next-line
        PreElement = new PreElement.type(PreElement.props);
        walk(PreElement.render());
      } catch (e) {
        e;
      }

      return;
    }

    if (!children) {
      return;
    }

    if (Array.isArray(children)) {
      children.forEach(function (child) {
        childElements.push(child);
        walk(child);
      });
    }

    childElements.push(children);
    walk(children);
  };

  walk(element);
  return childElements;
};

const noop = () => null;

const NodeRender = (props) => {
  const {nodes, idPrefix, canvas, onRenderFinish = noop} = props;
  const endpoints = [];

  if (!Array.isArray(nodes)) {
    return null;
  }

  useEffect(() => {
    if (!canvas) {
      return;
    }

    // 添加节点
    endpoints.forEach((endpoint) => {
      const {nodeId, endpointId} = endpoint;

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
        id: endpointId,
        orientation: [-1, 0],
        dom: document.getElementById(endpointId)
      });
    });

    // 移除多余锚点
    canvas.nodes.forEach(node => {
      const nodeId = node.id;
      const nodeEndpoints = endpoints.filter(endpoint => {
        return endpoint.nodeId === nodeId;
      });

      node.endpoints.forEach((endpoint) => {
        const nodeEndpointIds = nodeEndpoints.map(e => e.endpointId);
        if (!nodeEndpointIds.includes(endpoint.id)) {
          console.log(`remove endpoint ${endpoint.id} from ${node.id} successfully`);
          node.removeEndpoint(endpoint.id);
        }
      });
    });

    onRenderFinish();
  });

  return nodes.map(item => {
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
    const element = hasRender ? item.render() : <BfNode key={id} {...item} />;

    deepWalk(element).forEach(child => {
      if (typeof child !== 'object') {
        return;
      }

      if (child?.type?.name === 'Endpoint') {
        endpoints.push({
          endpointId: child.props.id,
          nodeId: item.id
        });
      }
    });

    return ReactDOM.createPortal(
      element,
      dom
    );
  });
};

NodeRender.propTypes = {
  canvas: PropTypes.object,             // 小蝴蝶实例
  nodes: PropTypes.array,
  idPrefix: PropTypes.string,
  onRenderFinish: PropTypes.func       // 节点以及锚点是否全部渲染完毕
};

export default NodeRender;
