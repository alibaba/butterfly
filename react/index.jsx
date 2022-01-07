import React from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import _debug from 'debug';
import {Canvas} from 'butterfly-dag/dist';

import props from './props';
import diff from './util/diff.js';
import recalc from './util/re-calc.js';
import CEndpoint from './coms/endpoint';
import relayout from './util/re-layout.js';
import processFactory from './util/process.js';
import NodeRender from './coms/node-render.jsx';
import CommonRender from './coms/common-render.jsx';
import defaultOptions from './util/default-options';
import checkRender from './util/check-render';

import 'butterfly-dag/dist/index.css';
import './index.less';

const debug = _debug('butterfly-react');

const noop = () => null;
window._ = _;
const defaultLinkCls = 'butterflies-link';

const call = (fn) => {
  if (!fn) {
    return noop;
  }

  if (typeof fn !== 'function') {
    return noop;
  }

  return fn;
};

/**
 * 原先使用 hooks 进行组件编写，但是由于 hooks 不好进行渲染顺序控制，故采用 class component 进行重构
 */
class ButterflyReact extends React.Component {
  constructor(props) {
    super(props);

    this.savePropsHash();

    // 画布唯一ID
    this.uniqId = `${new Date().getTime()}${Math.floor(Math.random() * 100)}`;
    this.process = processFactory(this.uniqId);

    // 画布实例
    this.canvas = null;
    // 渲染节点实例
    this.dom = null;

    // 是否强制渲染过
    this.hasForced = false;
  }

  savePropsHash() {
    this.phash = this.getPropsHash(this.props);
  }

  getPropsHash(props) {
    const {nodes = [], edges = [], groups = []} = props;

    return {
      nodeIds: nodes.map(node => node.id).join(','),
      nodeLength: nodes.length,
      edgeIds: edges.map(edge => edge.id).join(','),
      edgeLength: edges.length,
      groupIds: groups.map(group => group.id).join(','),
      groupLength: groups.length
    };
  }

  async _fourceUpdate() {
    return new Promise((resolve) => {
      this.forceUpdate(resolve);
    });
  }

  async _setState(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  async componentDidMount() {
    const dom = this.dom;
    const {options, nodes, edges, groups} = this.props;

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

    const canvas = this.canvas = new Canvas(mOptions);
    recalc(this.canvas);
    relayout(this.canvas);

    const data = this.process({
      nodes,
      edges,
      groups,
    });

    await new Promise((res, rej) => {
      try {
        // 优先画节点
        canvas.draw({
          nodes: data.nodes,
          groups: data.groups
        }, () => {
          res();
        });
      } catch (e) {
        rej(e);
      }
    });

    // 强制更新，渲染节点、锚点、节点组
    await this._fourceUpdate();
    // 事件监听
    this.onLinkEvent();

    call(this.props.onLoaded)(this.canvas);
  }

  // 控制渲染边上的cls
  alignEdgesCls() {
    const canvas = this.canvas;
    const {edges} = this.props;

    // 对齐edges和canvas.edges的className
    canvas.edges.forEach(cvsEdge => {
      const userEdge = edges.find(e => e.id === cvsEdge.id);

      // 对齐Edge的Classname
      const alignEdgeCls = () => {
        if (!cvsEdge.dom || !userEdge) {
          return;
        }

        const cls = [defaultLinkCls];

        if (userEdge.className) {
          cls.push(userEdge.className);
        }

        cvsEdge.dom.setAttribute('class', cls .join(' '));
      };

      // 对齐边上的arrow的Cls
      const alignEdgeArrowCls = () => {
        if (!cvsEdge.arrowDom || !userEdge) {
          return;
        }

        if (!userEdge.arrowClassName) {
          return;
        }

        cvsEdge.arrowDom.setAttribute('class', userEdge.arrowClassName);
      };

      alignEdgeCls();
      alignEdgeArrowCls();
    });
  }

  // 对齐节点的属性
  alignNodesCls() {
    const canvas = this.canvas;
    const {nodes} = this.props;

    canvas.nodes.forEach(cvsNode => {
      const userNode = nodes.find(e => e.id === cvsNode.id);

      const alignNodeCls = () => {
        if (!cvsNode || !userNode) {
          return;
        }
        for (let option in cvsNode.options) {
          if (userNode[option] !== undefined) {
            cvsNode.options[option] = userNode[option];
          }
        }
      };

      alignNodeCls();
    });
  }

  shouldComponentUpdate() {
    debug('align edge class');
    this.alignEdgesCls();
    debug('align node class');
    this.alignNodesCls();
    return true;
  }

  onLinkEvent() {
    const canvas = this.canvas;
    const {
      onCreateEdge,
      onEdgesChange,
      onDeleteEdge,
      onReconnectEdge
    } = this.props;

    // 由于 hooks 组件每次会重新生成 event，所以需要更新 event
    if (this._onCreateEdge) {
      canvas.off('system.link.connect', this._onCreateEdge);
    }

    if (this._onReconnectEdge) {
      canvas.off('system.link.reconnect', this._onReconnectEdge);
    }

    if (this._onDeleteEdge) {
      canvas.off('system.links.delete', this._onDeleteEdge);
    }

    this._onCreateEdge = ({links}) => {
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
    };

    canvas.on('system.link.connect', this._onCreateEdge);

    this._onReconnectEdge = (res) => {
      call(onReconnectEdge)(res);

      call(onEdgesChange)(canvas.edges);
    };

    canvas.on('system.link.reconnect', this._onReconnectEdge);

    this._onDeleteEdge = ({links}) => {
      const link = links[0];
      // 直接取消当前连线，然后重新绘制一条
      if (link) {
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
      }
    };

    canvas.on('system.links.delete', this._onDeleteEdge);
  }

  async componentDidUpdate(preProps) {
    if (!this.canvas) {
      return;
    }

    this.onLinkEvent();

    const hasCanvasChanged = this.props.nodes !== preProps.nodes ||
    this.props.edges !== preProps.edges ||
    this.props.groups !== preProps.groups ||
    this.props.nodes?.length !== preProps.nodes?.length ||
    this.props.edges?.length !== preProps.edges?.length ||
    this.props.groups?.length !== preProps.groups?.length;

    if (hasCanvasChanged) {
      debug('has sth change, align data');
      await this.alignCanvasData();
      // 等待下一次更新
      this.updateFlag = true;
    }

    if (this.canvas.updateFn) {
      this.canvas.updateFn();
    }
  }

  /**
   * 对齐画布数据和React数据
   * @param {BaseCanvas} canvas 画布实例
   * @param {Boolean} edge 是否对齐边
   */
  async alignCanvasData() {
    const canvas = this.canvas;

    // 利用ID，和当前的边，当前的节点进行对比
    if (!canvas) {
      return;
    }

    const {nodes, groups} = this.props;

    const oldNodes = canvas.nodes;
    const oldGroups = canvas.groups;

    const processNodes = () => {
      const {created, deleted} = diff(nodes, oldNodes);

      canvas.addNodes(this.process({nodes: created}).nodes);

      let deleteNodes = this.process({nodes: deleted}).nodes;
      let deleteNodesIds = [];
      try {
        deleteNodesIds = deleteNodes.map(n => n.id);
      } catch (e) {
        deleteNodesIds = deleteNodes;
      }

      canvas.removeNodes(deleteNodesIds);
    };

    const processGroups = () => {
      const {created, deleted} = diff(groups, oldGroups);

      this.process({groups: created}).groups.forEach(group => {
        canvas.addGroup(group);
      });

      this.process({groups: deleted}).groups.forEach(group => {
        canvas.removeGroup(group.id);
      });
    };

    processGroups();
    processNodes();

    await this.forceUpdate();
    this.alignEdgesCls();
  }

  alignEdge() {
    const canvas = this.canvas;

    // 利用ID，和当前的边，当前的节点进行对比
    if (!canvas) {
      return;
    }

    const {edges} = this.props;

    const oldEdges = canvas.edges;

    const processEdge = () => {
      const {created, deleted} = diff(edges, oldEdges);

      const createdEdges = this.process({edges: created}).edges;

      canvas.addEdges(createdEdges, true);

      canvas.removeEdges(this.process({edges: deleted}).edges.map(e => e.id));
    };

    processEdge();
    this.alignEdgesCls();

    if (this.updateFlag) {
      call(this.props.onEachFrame)();
      this.updateFlag = false;
    }
  }

  render() {
    const {className, groups, nodes, edges} = this.props;

    return (
      <div
        className={`${className || ''} butterfly-react`}
      >
        {
          this.canvas && (
            <React.Fragment>
              <NodeRender
                nodes={nodes}
                idPrefix={this.uniqId + 'bf_node_'}
                canvas={this.canvas}
                onRenderFinish={() => {
                  debug('node has rended finish, render edges');
                  // 对齐所有的锚点
                  this.canvas.recalc();
                  this.alignEdge();

                  if (this.hasForced) {
                    return this.hasForced = false;
                  }

                  this.forceUpdate();
                  this.hasForced = true;
                }}
              />
              {
                <CommonRender
                  data={edges}
                  renderKey="labelRender"
                  idPrefix={this.uniqId + 'edge_label_'}
                  type="edge"
                />
              }
              <CommonRender
                data={groups}
                type="group"
                idPrefix={this.uniqId + 'bf_group_'}
              />
            </React.Fragment>
          )
        }
        <div
          className="butterfly-react-container"
          ref={(ref) => this.dom = ref}
        />
      </div>
    );
  }
}

ButterflyReact.propTypes = props;

export default ButterflyReact;
export const Endpoint = CEndpoint;
