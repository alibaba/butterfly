'use strict';

const $ = require('jquery');
const _ = require('lodash');
const domtoimage = require('dom-to-image');

import Canvas from "../interface/canvas";
import Node from '../node/baseNode';
import Edge from '../edge/baseEdge';
import Group from '../group/baseGroup';
import Endpoint from '../endpoint/baseEndpoint';
import Layout from '../utils/layout';
import SelectCanvas from '../utils/selectCanvas';
// 画布和屏幕坐标地换算
import CoordinateService from '../utils/coordinate';
// scope的比较
import ScopeCompare from '../utils/scopeCompare';
// 网格模式
import GridService from '../utils/girdService';
// 辅助线模式
import GuidelineService from '../utils/guidelineService';
// 小地图模式
import Minimap from '../utils/minimap';
// 线段动画
import LinkAnimateUtil from '../utils/link_animate';


import './baseCanvas.less';

class BaseCanvas extends Canvas {
  constructor(options) {
    super(options);
    this.root = options.root;
    this.layout = options.layout; // layout部分也需要重新review
    this.zoomable = options.zoomable || false; // 可缩放
    this.moveable = options.moveable || false; // 可平移
    this.draggable = options.draggable || false; // 可拖动
    this.linkable = options.linkable || false; // 可连线
    this.disLinkable = options.disLinkable || false; // 可拆线

    this.theme = {
      edge: {
        type: _.get(options, 'theme.edge.type') || 'Bezier',
        Class: _.get(options, 'theme.edge.Class') || Edge,
        arrow: _.get(options, 'theme.edge.arrow'),
        arrowPosition: _.get(options, 'theme.edge.arrowPosition'),
        arrowOffset: _.get(options, 'theme.edge.arrowOffset'),
        label: _.get(options, 'theme.edge.label'),
        isRepeat: _.get(options, 'theme.edge.isRepeat') || false,
        isLinkMyself: _.get(options, 'theme.edge.isLinkMyself') || false,
        isExpandWidth: _.get(options, 'theme.edge.isExpandWidth') || false,
        defaultAnimate: _.get(options, 'theme.edge.defaultAnimate') || false,
      },
      endpoint: {
        position: _.get(options, 'theme.endpoint.position'),
        linkableHighlight: _.get(options, 'theme.endpoint.linkableHighlight') || false,
        limitNum: undefined,
        expandArea: {
          left: _.get(options, 'theme.endpoint.expandArea.left') || 10,
          right: _.get(options, 'theme.endpoint.expandArea.right') || 10,
          top: _.get(options, 'theme.endpoint.expandArea.top') || 10,
          bottom: _.get(options, 'theme.endpoint.expandArea.bottom') || 10,
        },
      },
      zoomGap: _.get(options, 'theme.zoomGap') || 0.001
    };

    // 贯穿所有对象的配置
    this.global = _.get(options, 'global', {
      isScopeStrict: _.get(options, 'global.isScopeStrict') // 是否为scope的严格模式
    });

    // 放大缩小和平移的数值
    this._zoomData = 1;
    this._moveData = [0, 0];

    this.groups = [];
    this.nodes = [];
    this.edges = [];

    // 框选模式，需要重新考虑(默认单选)
    this.isSelectMode = false;
    this.selecModel = [];
    this.selectItem = {
      nodes: [],
      edges: [],
      groups: [],
      endpoints: []
    };
    // 框选前需要纪录状态
    this._remarkZoom = undefined;
    this._remarkMove = undefined;

    this.svg = null;
    this.wrapper = null;
    this.canvasWrapper = null;
    // 加一层wrapper方便处理缩放，平移
    this._genWrapper();
    // 加一层svg画线条
    this._genSvgWrapper();
    // 加一层canvas方便处理辅助
    this._genCanvasWrapper();
    // 动画初始化
    LinkAnimateUtil.init(this.svg);

    // 统一处理画布拖动事件
    this._dragType = null;
    this._dragNode = null;
    this._dragEndpoint = null;
    this._dragEdges = [];
    this._dragGroup = null;

    // 初始化一些参数
    this._rootWidth = $(this.root).width();
    this._rootHeight = $(this.root).height();

    // 网格布局
    this._gridService = new GridService({
      root: this.root,
      canvas: this
    });

    // 辅助线
    this._guidelineService = new GuidelineService({
      root: this.root,
      canvas: this
    });

    // 坐标转换服务
    this._coordinateService = new CoordinateService({
      canvas: this,
      terOffsetX: $(this.root).offset().left,
      terOffsetY: $(this.root).offset().top,
      terWidth: $(this.root).width(),
      terHeight: $(this.root).height(),
      canOffsetX: this._moveData[0],
      canOffsetY: this._moveData[1],
      scale: this._zoomData
    });

    this._addEventListener();

    this._unionData = {
      __system: {
        nodes: [],
        edges: [],
        groups: [],
        endpoints: []
      }
    };
  }

  updateRootResize() {
    this._coordinateService._changeCanvasInfo({
      terOffsetX: $(this.root).offset().left,
      terOffsetY: $(this.root).offset().top,
      terWidth: $(this.root).width(),
      terHeight: $(this.root).height()
    });
  }

  draw(opts, callback) {
    const groups = opts.groups || [];
    const nodes = opts.nodes || [];
    const edges = opts.edges || [];

    // 自动布局需要重新review
    if (this.layout) {
      this._autoLayout({
        groups,
        nodes,
        edges
      });
    }

    // 首次加载，异步逐步加载
    let groupPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // 生成groups
        this.addGroups(groups);
        resolve();
      });
    });
    let nodePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // 生成nodes
        this.addNodes(nodes);
        resolve();
      }, 10);
    });
    let edgePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // 生成edges
        this.addEdges(edges);
        resolve();
      }, 20);
    });
    Promise.all([groupPromise, nodePromise, edgePromise]).then(() => {
      callback && callback({
        nodes: this.nodes,
        edges: this.edges,
        groups: this.groups
      });
    });
  }

  getNode(id) {
    return _.find(this.nodes, item => item.id === id);
  }

  getEdge(id) {
    return _.find(this.edges, item => item.id === id);
  }

  getGroup(id) {
    return _.find(this.groups, item => item.id === id);
  }

  addGroup(group, nodes, options) {
    const container = $(this.wrapper);
    const GroupClass = group.Class || Group;
    const _groupObj = new GroupClass(_.assign(_.cloneDeep(group), {
      _global: this.global,
      _emit: this.emit.bind(this),
      _on: this.on.bind(this),
    }));
    if (this._isExistGroup(_groupObj)) {
      // 后续用新的group代码旧的group
      console.warn(`group:${_groupObj.id} has existed`);
      return;
    }
    _groupObj.init();
    container.prepend(_groupObj.dom);
    this.groups.push(_groupObj);

    _groupObj._createEndpoint();

    _groupObj.mounted && _groupObj.mounted();

    if (nodes && nodes.length > 0) {
      // 过滤掉scope不匹配的节点 和 已存在其他组的node
      nodes = nodes.filter((_node) => {
        return ScopeCompare(_node.scope, _groupObj.scope, _.get(this, 'global.isScopeStrict')) && (_node.group === _groupObj.id || _node.group == undefined);
      });

      let _isAbsolutePos = _.get(options, 'posType', 'absolute') === 'absolute';
      // 重新计算group的位置
      let _groupLeft = Infinity;
      let _groupTop = Infinity;
      nodes.forEach((_node) => {
        if (_isAbsolutePos) {
          if (_node.left < _groupLeft) {
            _groupLeft = _node.left;
          }
          if (_node.top < _groupTop) {
            _groupTop = _node.top;
          }
        }
      });
      _groupObj._moveTo(_groupLeft - _.get(options, 'padding', 5), _groupTop - _.get(options, 'padding', 5));

      // 添加节点
      let _newNodes = nodes.map((_node) => {
        let newNode = null;
        // 已存在节点
        let _existNode = _.find(this.nodes, (__node) => {
          return __node.id === _node.id;
        });
        if (_existNode) {
          this.removeNode(_existNode.id, true, true);
          _existNode._init({
            dom: _existNode.dom,
            top: _existNode.top - _groupObj.top,
            left: _existNode.left - _groupObj.left,
            group: _groupObj.id
          })
          newNode = this.addNode(_existNode, true);
        } else {
          let _nodeObj = null;
          if (_node instanceof Node) {
            _nodeObj = _node;
          } else {
            const _Node = _node.Class || Node;
            _nodeObj = new _Node(_.assign(_.cloneDeep(_node), {
              _global: this.global,
              _on: this.on.bind(this),
              _emit: this.emit.bind(this),
              _endpointLimitNum: this.theme.endpoint.limitNum,
              draggable: _node.draggable !== undefined ? _node.draggable :  this.draggable
            }));
          }
          if (_isAbsolutePos) {
            _nodeObj.top = _nodeObj.top - _groupObj.top;
            _nodeObj.left = _nodeObj.left - _groupObj.left;
          }
          _nodeObj.group = _groupObj.id;
          newNode = this.addNode(_nodeObj);
        }
        return newNode;     
      });

       // 重新计算group的大小
      let _groupWidth = -Infinity;
      let _groupHeight = -Infinity;
      _newNodes.forEach((_node) => {
        let _w = $(_node.dom).width();
        let _h = $(_node.dom).height();
        if (_groupWidth < _node.left + _w) {
          _groupWidth = _node.left + _w;
        }
        if (_groupHeight < _node.top + _h) {
          _groupHeight = _node.top + _h;
        }
      });
      _groupObj.setSize(_groupWidth + _.get(options, 'padding', 5) * 2, _groupHeight + _.get(options, 'padding', 5) * 2);
    }
    return _groupObj;
  }

  addNodes(nodes, isNotEventEmit) {
    const _canvasFragment = document.createDocumentFragment();
    const container = $(this.wrapper);
    const result = nodes.filter((node) => {
      if (node.group) {
        let _existGroup = this.getGroup(node.group);
        if (!_existGroup) {
          console.warn(`nodeId为${node.id}的节点找不到groupId为${node.group}的节点组，因此无法渲染`);
          return false;
        }
      }
      return true;
    }).map((node) => {
      let _nodeObj = null;
      if (node instanceof Node) {
        _nodeObj = node;
      } else {
        const _Node = node.Class || Node;
        _nodeObj = new _Node(_.assign(_.cloneDeep(node), {
          _global: this.global,
          _on: this.on.bind(this),
          _emit: this.emit.bind(this),
          _endpointLimitNum: this.theme.endpoint.limitNum,
          draggable: node.draggable !== undefined ? node.draggable :  this.draggable
        }));
      }

      if (this._isExistNode(_nodeObj)) {
        // 后续用新的node代码旧的node
        console.warn(`node:${_nodeObj.id} has existed`);
        return;
      }

      // 节点初始化
      _nodeObj._init();
      // 一定要比group的addNode执行的之前，不然会重复把node加到this.nodes里面
      this.nodes.push(_nodeObj);

      // 假如节点存在group，即放进对应的节点组里
      const existGroup = _nodeObj.group ? this.getGroup(_nodeObj.group) : null;
      if (existGroup) {
        if (ScopeCompare(_nodeObj.scope, existGroup.scope, _.get(this, 'global.isScopeStrict'))) {
          existGroup._appendNodes([_nodeObj]);
        } else {
          console.warn(`nodeId为${_nodeObj.id}的节点和groupId${existGroup.id}的节点组scope值不符，无法加入`);
        }
      } else {
        _canvasFragment.appendChild(_nodeObj.dom);
      }
      return _nodeObj;
    }).filter((item) => {
      return !!item;
    });

    // 批量插入dom，性能优化
    container.append(_canvasFragment);

    result.forEach((item) => {
      // 渲染endpoint
      item._createEndpoint(isNotEventEmit);

      // 节点挂载
      !isNotEventEmit && item.mounted && item.mounted();
    });

    if (result && result.length > 0 && !isNotEventEmit) {
      this.emit('system.nodes.add', {
        nodes: result
      });
      this.emit('events', {
        type: 'nodes:add',
        nodes: result
      });
    }

    return result;
  }

  addNode(node, isNotEventEmit) {
    return this.addNodes([node], isNotEventEmit)[0];
  }

  addEdges(links) {
    $(this.svg).css('visibility', 'hidden');

    const _edgeFragment = document.createDocumentFragment();
    const _labelFragment = document.createDocumentFragment();

    const result = links.map((link) => {
      const EdgeClass = link.Class || this.theme.edge.Class;
      if (link.type === 'endpoint') {
        let sourceNode = null;
        let targetNode = null;
        let _sourceType = link._sourceType;
        let _targetType = link._targetType;

        if (link.sourceNode instanceof Node) {
          _sourceType = 'node';
          sourceNode = link.sourceNode;
        } else if (link.sourceNode instanceof Group) {
          _sourceType = 'group';
          sourceNode = link.sourceNode;
        } else {
          if (link._sourceType) {
            sourceNode = _sourceType === 'node' ? this.getNode(link.sourceNode) : this.getGroup(link.sourceNode);
          } else {
            let _node = this.getNode(link.sourceNode);
            if (_node) {
              _sourceType = 'node';
              sourceNode = _node;
            } else {
              _sourceType = 'group';
              sourceNode = this.getGroup(link.sourceNode);
            }
          }
        }

        if (link.targetNode instanceof Node) {
          _targetType = 'node';
          targetNode = link.targetNode;
        } else if (link.targetNode instanceof Group) {
          _targetType = 'group';
          targetNode = link.targetNode;
        } else {
          if (link._targetType) {
            targetNode = _targetType === 'node' ? this.getNode(link.targetNode) : this.getGroup(link.targetNode);
          } else {
            let _node = this.getNode(link.targetNode);
            if (_node) {
              _targetType = 'node';
              targetNode = _node;
            } else {
              _targetType = 'group';
              targetNode = this.getGroup(link.targetNode);
            }
          }
        }

        if (!sourceNode || !targetNode) {
          console.warn(`butterflies error: can not connect edge. link sourceNodeId:${link.sourceNode};link targetNodeId:${link.targetNode}`);
          return;
        }

        let sourceEndpoint = null;
        let targetEndpoint = null;

        if (link.sourceEndpoint && link.sourceEndpoint instanceof Endpoint) {
          sourceEndpoint = link.sourceEndpoint;
        } else {
          sourceEndpoint = sourceNode.getEndpoint(link.source, 'source');
        }

        if (link.targetEndpoint && link.targetEndpoint instanceof Endpoint) {
          targetEndpoint = link.targetEndpoint;
        } else {
          targetEndpoint = targetNode.getEndpoint(link.target, 'target');
        }

        if (!sourceEndpoint || !targetEndpoint) {
          console.warn(`butterflies error: can not connect edge. link sourceId:${link.source};link targetId:${link.target}`);
          return;
        }

        // 线条去重
        if (!this.theme.edge.isRepeat) {
          let _isRepeat = _.some(this.edges, (_edge) => {
            let _result = false;
            if (sourceNode) {
              _result = sourceNode.id === _edge.sourceNode.id && sourceEndpoint.id === _edge.sourceEndpoint.id && _sourceType === _edge.sourceEndpoint.nodeType;
            }

            if (targetNode) {
              _result = _result && (targetNode.id === _edge.targetNode.id && targetEndpoint === _edge.targetEndpoint.id && _targetType === _edge.targetEndpoint.nodeType);
            }

            return _result;
          });
          if (_isRepeat) {
            console.warn(`id为${sourceEndpoint.id}-${targetEndpoint.id}的线条连接重复，请检查`);
            return;
          }
        }

        const edge = new EdgeClass({
          type: 'endpoint',
          id: link.id,
          label: link.label,
          shapeType: link.shapeType || this.theme.edge.type,
          orientationLimit: this.theme.endpoint.position,
          isExpandWidth: this.theme.edge.isExpandWidth,
          defaultAnimate: this.theme.edge.defaultAnimate,
          sourceNode,
          targetNode,
          sourceEndpoint,
          targetEndpoint,
          arrow: link.arrow,
          arrowPosition: link.arrowPosition,
          arrowOffset: link.arrowOffset,
          options: link,
          _sourceType,
          _targetType,
          _global: this.global,
          _on: this.on.bind(this),
          _emit: this.emit.bind(this),
        });
        edge._init();

        _edgeFragment.appendChild(edge.dom);

        if (edge.labelDom) {
          _labelFragment.appendChild(edge.labelDom);
        }

        if (edge.arrowDom) {
          _edgeFragment.appendChild(edge.arrowDom);
        }

        this.edges.push(edge);

        edge.mounted && edge.mounted();

        // 假如sourceEndpoint和targetEndpoint没属性，则自动添加上
        if (sourceEndpoint.type === undefined) {
          sourceEndpoint._tmpType = 'source';
        }
        if (targetEndpoint.type === undefined) {
          targetEndpoint._tmpType = 'target';
        }

        return edge;
      } else {
        const sourceNode = this.getNode(link.source);
        const targetNode = this.getNode(link.target);

        if (!sourceNode || !targetNode) {
          console.warn(`butterflies error: can not connect edge. link sourceId:${link.source};link targetId:${link.target}`);
          return;
        }

        const edge = new EdgeClass({
          type: 'node',
          id: link.id,
          label: link.label,
          sourceNode,
          targetNode,
          shapeType: link.shapeType || this.theme.edge.type,
          orientationLimit: this.theme.endpoint.position,
          arrow: link.arrow,
          arrowPosition: link.arrowPosition,
          arrowOffset: link.arrowOffset,
          isExpandWidth: this.theme.edge.isExpandWidth,
          defaultAnimate: this.theme.edge.defaultAnimate,
          _global: this.global,
          _on: this.on.bind(this),
          _emit: this.emit.bind(this),
        });
        edge._init();

        _edgeFragment.appendChild(edge.dom);

        if (edge.labelDom) {
          _labelFragment.appendChild(edge.labelDom);
        }

        if (edge.arrowDom) {
          _edgeFragment.appendChild(edge.arrowDom);
        }

        this.edges.push(edge);

        edge.mounted && edge.mounted();

        return edge;
      }
    }).filter(item => item);

    $(this.svg).append(_edgeFragment);

    $(this.wrapper).append(_labelFragment);

    result.forEach((link) => {
      let _soucePoint = {};
      let _targetPoint = {};
      if (link.type === 'endpoint') {
        _soucePoint = {
          pos: [link.sourceEndpoint._posLeft + link.sourceEndpoint._width / 2, link.sourceEndpoint._posTop + link.sourceEndpoint._height / 2],
          orientation: link.sourceEndpoint.orientation ? link.sourceEndpoint.orientation : undefined
        };
        _targetPoint = {
          pos: [link.targetEndpoint._posLeft + link.targetEndpoint._width / 2, link.targetEndpoint._posTop + link.targetEndpoint._height / 2],
          orientation: link.targetEndpoint.orientation ? link.targetEndpoint.orientation : undefined
        };
      } else if (link.type === 'node') {
        _soucePoint = {
          pos: [link.sourceNode.left + link.sourceNode.getWidth() / 2, link.sourceNode.top + link.sourceNode.getHeight() / 2]
        };

        _targetPoint = {
          pos: [link.targetNode.left + link.targetNode.getWidth() / 2, link.targetNode.top + link.targetNode.getHeight() / 2]
        };
      }
      link.redraw(_soucePoint, _targetPoint);
    });

    $(this.svg).css('visibility', 'visible');
    return result;
  }

  addEdge(link) {
    return this.addEdges([link])[0];
  }

  addGroups(datas) {
    return datas.map(item => this.addGroup(item)).filter(item => item);
  }

  removeNode(nodeId, isNotDelEdge, isNotEventEmit) {
    const index = _.findIndex(this.nodes, _node => _node.id === nodeId);
    if (index === -1) {
      console.warn(`找不到id为：${nodeId}的节点`);
      return;
    }

    // 删除邻近的线条
    const neighborEdges = this.getNeighborEdges(nodeId);

    if (!isNotDelEdge) {
      this.removeEdges(neighborEdges, isNotEventEmit);
    }

    // 删除节点
    const node = this.nodes[index];
    node.destroy(isNotEventEmit);

    const _rmNodes = this.nodes.splice(index, 1);
    // 假如在group里面
    if (node.group) {
      const group = this.getGroup(node.group);
      if (group) {
        group.nodes = group.nodes.filter(item => item.id !== node.id);
      }
    }

    if (_rmNodes.length > 0) {
      if(!isNotEventEmit) {
        this.emit('system.node.delete', {
          node: _rmNodes[0]
        });
        this.emit('events', {
          type: 'node:delete',
          node: _rmNodes[0]
        });
      }
      return {
        nodes: [_rmNodes[0]],
        edges: neighborEdges,
      };
    }
    return {
      nodes: [],
      edges: []
    };
  }

  removeNodes(nodeIds, isNotDelEdge, isNotEventEmit) {
    let rmNodes = [];
    let rmEdges = [];
    nodeIds.map(id => this.removeNode(id, isNotDelEdge, isNotEventEmit)).forEach((result) => {
      rmNodes = rmNodes.concat(result.nodes);
      rmEdges = rmEdges.concat(result.edges);
    });
    return {
      nodes: rmNodes,
      edges: rmEdges
    };
  }

  removeEdges(edges, isNotEventEmit) {
    let result = [];
    edges.forEach((_edge) => {
      let edgeIndex = -1;
      if (_edge instanceof Edge) {
        edgeIndex = _.findIndex(this.edges, (item) => {
          if (item.type === 'node') {
            return _edge.sourceNode.id === item.sourceNode.id && _edge.targetNode.id === item.targetNode.id;
          } else {
            return (
              _.get(_edge, 'sourceNode.id') === _.get(item, 'sourceNode.id') &&
              _.get(_edge, 'sourceEndpoint.id') === _.get(item, 'sourceEndpoint.id') &&
              _.get(_edge, 'sourceEndpoint.nodeType') === _.get(item, 'sourceEndpoint.nodeType')
            ) && (
                _.get(_edge, 'targetNode.id') === _.get(item, 'targetNode.id') &&
                _.get(_edge, 'targetEndpoint.id') === _.get(item, 'targetEndpoint.id') &&
                _.get(_edge, 'targetEndpoint.nodeType') === _.get(item, 'targetEndpoint.nodeType')
              );
          }
        });
      } else if (_.isString(_edge)) {
        edgeIndex = _.findIndex(this.edges, (item) => {
          return _edge === item.id;
        });
      } else {
        console.warn(`删除线条错误，传入参数有误，请检查`);
        return;
      }
      if (edgeIndex !== -1) {
        result = result.concat(this.edges.splice(edgeIndex, 1));
      } else {
        console.warn(`删除线条错误，不存在值为${_edge.id}的线`);
      }
    });

    result.forEach((item) => {
      item.destroy(isNotEventEmit);
    });

    // 把endpoint重新赋值
    result.forEach((_rmEdge) => {
      if (_.get(_rmEdge, 'sourceEndpoint._tmpType') === 'source') {
        let isExistEdge = _.some(this.edges, (edge) => {
          return _rmEdge.sourceNode.id === edge.sourceNode.id && _rmEdge.sourceEndpoint.id === edge.sourceEndpoint.id;
        });
        !isExistEdge && (_rmEdge.sourceEndpoint._tmpType = undefined);
      }
      if (_.get(_rmEdge, 'targetEndpoint._tmpType') === 'target') {
        let isExistEdge = _.some(this.edges, (edge) => {
          return _rmEdge.targetNode.id === edge.targetNode.id && _rmEdge.targetEndpoint.id === edge.targetEndpoint.id;
        });
        !isExistEdge && (_rmEdge.targetEndpoint._tmpType = undefined);
      }
    });
    return result;
  }

  removeEdge(edge, isNotEventEmit) {
    return this.removeEdges([edge], isNotEventEmit)[0];
  }

  removeGroup(groupId) {
    const group = this.getGroup(groupId);
    if (!group) {
      console.warn(`未找到id为${groupId}的节点组`);
    }
    group._isDeleting = true;
    group.nodes.forEach((_node) => {
      let rmItem = this.removeNode(_node.id, true, true);
      let rmNode = rmItem.nodes[0];
      let neighborEdges = rmItem.edges;
      rmNode._init({
        top: _node.top + group.top,
        left: _node.left + group.left,
        dom: _node.dom,
        _isDeleteGroup: true
      });
      this.addNode(rmNode, true);
      neighborEdges.forEach((item) => {
        item.redraw();
      });
    });
    // 删除邻近的线条
    const neighborEdges = this.getNeighborEdges(group.id, 'group');
    this.removeEdges(neighborEdges);
    // 删除group
    const index = _.findIndex(this.groups, _group => _group.id === groupId);
    this.groups.splice(index, 1)[0];
    group.destroy();
    return group;
  }

  getNeighborEdges(id, type) {

    let node = undefined;
    let group = undefined;
    if (type === 'node') {
      node = _.find(this.nodes, item => id === item.id);
    } else if (type === 'group') {
      group = _.find(this.groups, item => id === item.id);
    } else {
      node = _.find(this.nodes, item => id === item.id);
      node && !type && (type = 'node');
      group = _.find(this.groups, item => id === item.id);
      group && !type && (type = 'group');
    }

    return this.edges.filter((item) => {
      if (type === 'node') {
        return _.get(item, 'sourceNode.id') === node.id || _.get(item, 'targetNode.id') === node.id;
      } else {
        return _.get(item, 'sourceNode.id') === group.id || _.get(item, 'targetNode.id') === group.id;
      }
    });
  }

  getNeighborNodes(nodeId) {
    const result = [];
    const node = _.find(this.nodes, item => nodeId === item.id);
    if (!node) {
      console.warn(`找不到id为${nodeId}的节点`);
    }
    this.edges.forEach((item) => {
      if (item.sourceNode && item.sourceNode.id === nodeId) {
        result.push(item.targetNode.id);
      } else if (item.targetNode && item.targetNode.id === nodeId) {
        result.push(item.sourceNode.id);
      }
    });

    return result.map(id => this.getNode(id));
  }

  /**
   * 查找 N 层节点
   * 
   * @param {Object} options 
   * @param {Node} options.node
   * @param {Endpoint} options.endpoint
   * @param {String} options.type
   * @param {Number} options.level
   * @param {Function} options.iteratee
   * @returns {Object} filteredGraph
   */
  getNeighborNodesAndEdgesByLevel({node, endpoint, type = 'out', level = Infinity, iteratee = () => true}) {
    // 先求source-target level 层
    if (!node || !this.nodes.length) return {nodes: [], edges: []};
    if (level == 0 || !this.edges.length) return {nodes: [node], edges: []};
    let quene = [];
    let neighbors = [];
    const visited = new Set();
    
    // 1. 生成邻接表
    // adjTable = {[nodeId]: {[endpointId]: [[targetNode, targetEndpoint]]}}
    const adjTable = this.getAdjcentTable(type);

    if (endpoint) {
      quene = _.get(adjTable, [node.id, endpoint.id], []).map(d => [...d, 1]);
    } else {
      quene = (Object.values(_.get(adjTable, node.id, {})) || []).flatMap(d => d.map(n => n.concat(1)));
    }

    visited.add(node.id);

    if (!quene.length) return {nodes: [node], edges: []};
    // 2. BFS,得到 nodes 集合
    while(quene.length) {
      const [$node, $endpoint, $level] = quene.shift();
      if (
        visited.has($node.id) ||
        $level > level ||
        !iteratee($node, $endpoint, $level)
      ) continue;

      // TODO: 锚点向后传递？节点向后传递？
      neighbors = (Object.values(_.get(adjTable, $node.id, {})) || []).forEach((neighborsWithEndpoint) => {
        neighborsWithEndpoint.forEach(neighbor => {
          const [$nNode, $nEndpoint] = neighbor;
          if (visited.has($nNode.id)) return;
          quene.push([...neighbor, $level + 1]);
        });
      });
      visited.add($node.id);
    }
    const nodes = new Set();
    const edges = new Set();
    // 4. 获取 edges，1. 只考虑点集 2. 考虑边
    // 目前只考虑点集内的全部边
    this.edges.forEach(edge => {
      const { sourceNode, sourceEndpoint, targetNode, targetEndpoint } = edge;
      if (visited.has(sourceNode.id) &&  visited.has(targetNode.id)) {
        nodes.add(sourceNode);
        nodes.add(targetNode);
        edges.add(edge);
      }
    });

    return {
      nodes: [...nodes],
      edges: [...edges]
    }
  }

  getAdjcentTable(type) {
    // 包含正逆的邻接表
    // {[nodeId]: {[endpointId]: [[targetNode, targetEndpoint]]}}
    const adjTable = {};
    this.edges.forEach(edge => {
      const { sourceNode, sourceEndpoint, targetNode, targetEndpoint } = edge;
      const sourceNodeId = sourceNode.id;
      const sourceEndpointId = sourceEndpoint.id;
      const targetNodeId = targetNode.id;
      const targetEndpointId = targetEndpoint.id;
      // in and all
      if (type !== 'out') {
        if (!adjTable[targetNodeId]) adjTable[targetNodeId] = {};
        if (!adjTable[targetNodeId][targetEndpointId]) adjTable[targetNodeId][targetEndpointId] = [];
  
        adjTable[targetNodeId][targetEndpointId].push([sourceNode, sourceEndpoint]);
      }
      // out and all
      if (type !== 'in') {
        if (!adjTable[sourceNodeId]) adjTable[sourceNodeId] = {};
        if (!adjTable[sourceNodeId][sourceEndpointId]) adjTable[sourceNodeId][sourceEndpointId] = [];
  
        adjTable[sourceNodeId][sourceEndpointId].push([targetNode, targetEndpoint]);
      }

    });
    this.nodes.forEach(node => {
      if (!adjTable[node.id]) adjTable[node.id] = {};
    });
    return adjTable;
  }

  setZoomable(flat) {
    if (!this._zoomCb) {
      this._zoomCb = (event) => {
        event.preventDefault();
        const deltaY = event.deltaY;
        this._zoomData += deltaY * this.theme.zoomGap;

        if (this._zoomData < 0.25) {
          this._zoomData = 0.25;
          return;
        } if (this._zoomData > 5) {
          this._zoomData = 5;
          return;
        }

        const platform = ['webkit', 'moz', 'ms', 'o'];
        const scale = `scale(${this._zoomData})`;
        for (let i = 0; i < platform.length; i++) {
          this.wrapper.style[`${platform[i]}Transform`] = scale;
        }
        this.wrapper.style.transform = scale;
        this._coordinateService._changeCanvasInfo({
          wrapper: this.wrapper,
          girdWrapper: this._guidelineService.dom,
          mouseX: event.clientX,
          mouseY: event.clientY,
          scale: this._zoomData
        });
        this._guidelineService.zoom(this._zoomData);
        this.emit('system.canvas.zoom', {
          zoom: this._zoomData
        });
        this.emit('events', {
          type: 'canvas.zoom',
          zoom: this._zoomData
        });
      };
    }

    if (flat) {
      this.root.addEventListener('wheel', this._zoomCb);
    } else {
      this.root.removeEventListener('wheel', this._zoomCb);
    }
  }

  setMoveable(flat) {
    if (flat) {
      this.moveable = true;
      if (this._dragType === 'canvas:drag') {
        this.moveable = false;
      }
    } else {
      this.moveable = false;
    }
  }

  setLinkable(flat) {
    this.linkable = !!flat;
  }

  setDisLinkable(flat) {
    this.disLinkable = !!flat;
  }

  setDraggable(flat) {
    this.nodes.forEach((node) => {
      node.setDraggable(flat);
    });
    this.draggable = flat;
  }

  focusNodesWithAnimate(param, type = ['node'], options, callback) {
    // 画布里的可视区域
    let canLeft = Infinity;
    let canRight = -Infinity;
    let canTop = Infinity;
    let canBottom = -Infinity;

    if (_.includes(type, 'node')) {
      let nodeIds = param.nodes;
      this.nodes.filter((_node) => {
        return _.find(nodeIds, (id) => {
          return _node.id === id;
        }) !== undefined;
      }).forEach((_node) => {
        let _nodeLeft = _node.left;
        let _nodeRight = _node.left + _node.getWidth();
        let _nodeTop = _node.top;
        let _nodeBottom = _node.top + _node.getHeight();
        if (_node.group) {
          let group = this.getGroup(_node.group);
          if (group) {
            _nodeLeft += group.left;
            _nodeRight += group.left;
            _nodeTop += group.top;
            _nodeBottom += group.top;
          }
        }
        if (_nodeLeft < canLeft) {
          canLeft = _nodeLeft;
        }
        if (_nodeRight > canRight) {
          canRight = _nodeRight;
        }
        if (_nodeTop < canTop) {
          canTop = _nodeTop;
        }
        if (_nodeBottom > canBottom) {
          canBottom = _nodeBottom;
        }
      });
    }

    if (_.includes(type, 'group')) {
      let groupIds = param.groups;
      this.groups.filter((_group) => {
        return _.find(groupIds, (id) => {
          return id === _group.id;
        });
      }).forEach((_group) => {
        let _groupLeft = _group.left;
        let _groupRight = _group.left + _group.getWidth();
        let _groupTop = _group.top;
        let _groupBottom = _group.top + _group.getHeight();
        if (_groupLeft < canLeft) {
          canLeft = _groupLeft;
        }
        if (_groupRight > canRight) {
          canRight = _groupRight;
        }
        if (_groupTop < canTop) {
          canTop = _groupTop;
        }
        if (_groupBottom > canBottom) {
          canBottom = _groupBottom;
        }
      });
    }
    let customOffset = _.get(options, 'offset') || [0, 0];
    let canDisX = canRight - canLeft;
    let terDisX = this._rootWidth - customOffset[0];
    let canDisY = canBottom - canTop;
    let terDisY = this._rootHeight - customOffset[1];
    let scaleX = terDisX / canDisX;
    let scaleY = terDisY / canDisY;

    // 这里要根据scale来判断
    let scale = scaleX < scaleY ? scaleX : scaleY;
    scale = 1 < scale ? 1 : scale;

    let terLeft = this._coordinateService._canvas2terminal('x', canLeft, {
      scale: scale,
      canOffsetX: 0,
      canOffsetY: 0,
      terOffsetX: 0,
      terOffsetY: 0,
      originX: 50,
      originY: 50
    });
    let terRight = this._coordinateService._canvas2terminal('x', canRight, {
      scale: scale,
      canOffsetX: 0,
      canOffsetY: 0,
      terOffsetX: 0,
      terOffsetY: 0,
      originX: 50,
      originY: 50
    });
    let terTop = this._coordinateService._canvas2terminal('y', canTop, {
      scale: scale,
      canOffsetX: 0,
      canOffsetY: 0,
      terOffsetX: 0,
      terOffsetY: 0,
      originX: 50,
      originY: 50
    });
    let terBottom = this._coordinateService._canvas2terminal('y', canBottom, {
      scale: scale,
      canOffsetX: 0,
      canOffsetY: 0,
      terOffsetX: 0,
      terOffsetY: 0,
      originX: 50,
      originY: 50
    });

    let offsetX = (terLeft + terRight - this._rootWidth) / 2;
    let offsetY = (terTop + terBottom - this._rootHeight) / 2;

    offsetX = -offsetX + customOffset[0];
    offsetY = -offsetY + customOffset[1];

    const time = 500;
    $(this.wrapper).animate({
      top: offsetY,
      left: offsetX,
    }, time);
    this._moveData = [offsetX, offsetY];

    this._coordinateService._changeCanvasInfo({
      canOffsetX: offsetX,
      canOffsetY: offsetY,
      scale: scale,
      originX: 50,
      originY: 50
    });

    this.zoom(scale, callback);
  }
  focusCenterWithAnimate(options, callback) {
    let nodeIds = this.nodes.map((item) => {
      return item.id;
    });
    let groupIds = this.groups.map((item) => {
      return item.id;
    });

    this.focusNodesWithAnimate({
      nodes: nodeIds,
      groups: groupIds
    }, ['node', 'group'], options, callback);
  }
  focusNodeWithAnimate(param, type = 'node', options, callback) {
    let node = null;

    if (_.isFunction(param)) { // 假如传入的是filter，则按照用户自定义的规则来寻找
      node = type === 'node' ? _.find(this.nodes, param) : _.find(this.groups, param);
    } else { // 假如传入的是id，则按照默认规则寻找
      node = type === 'node' ? _.find(this.nodes, item => item.id === param) : _.find(this.groups, item => item.id === param);
    }

    let top = 0;
    let left = 0;
    if (!node) {
      return;
    }
    top = node.top || node.y;
    left = node.left || node.x;
    if (node.height) {
      top += node.height / 2;
    }
    if (node.width) {
      left += node.width / 2;
    }

    if (node.group) {
      const group = _.find(this.groups, _group => _group.id === node.group);
      if (!group) return;
      top += group.top || group.y;
      left += group.left || group.x;
      if (group.height) {
        top += group.height / 2;
      }
      if (group.width) {
        left += group.width / 2;
      }
    }

    let customOffset = _.get(options, 'offset') || [0, 0];

    const containerW = this._rootWidth;
    const containerH = this._rootHeight;

    const targetY = containerH / 2 - top + customOffset[1];
    const targetX = containerW / 2 - left + customOffset[0];

    const time = 500;

    // animate不支持scale，使用setInterval自己实现
    $(this.wrapper).animate({
      top: targetY,
      left: targetX,
    }, time);
    this._moveData = [targetX, targetY];

    this._coordinateService._changeCanvasInfo({
      canOffsetX: targetX,
      canOffsetY: targetY,
      originX: 50,
      originY: 50,
      scale: 1
    });

    this.zoom(1, callback);

    this._guidelineService.isActive && this._guidelineService.clearCanvas();
  }

  zoom(param, callback) {
    if (param < 0.25) {
      param = 0.25;
    } if (param > 5) {
      param = 5;
    }
    const time = 50;
    let frame = 1;
    const gap = param - this._zoomData;
    const interval = gap / 20;
    let timer = null;
    if (gap !== 0) {
      timer = setInterval(() => {
        this._zoomData += interval;
        let _canvasInfo = {
          scale: this._zoomData
        };
        if (this._coordinateService.originX === undefined || this._coordinateService.originY === undefined) {
          _canvasInfo['originX'] = 50;
          _canvasInfo['originY'] = 50;
        }
        this._coordinateService._changeCanvasInfo(_canvasInfo);
        this._guidelineService.zoom(this._zoomData);
        $(this.wrapper).css({
          transform: `scale(${this._zoomData})`
        });
        if (frame === 20) {
          clearInterval(timer);
          this.emit('system.canvas.zoom', {
            zoom: this._zoomData
          });
          this.emit('events', {
            type: 'canvas.zoom',
            zoom: this._zoomData
          });
          callback && callback();
        }
        frame++;
      }, time / 20);
    } else {
      callback && callback();
    }
  }

  setOrigin(data) {
    let originX = (data[0] || '0').toString().replace('%', '');
    let originY = (data[1] || '0').toString().replace('%', '');
    this._coordinateService._changeCanvasInfo({
      originX: parseFloat(originX),
      originY: parseFloat(originY)
    });
  }

  move(position) {
    $(this.wrapper)
      .css('left', position[0])
      .css('top', position[1]);
    this._coordinateService._changeCanvasInfo({
      canOffsetX: position[0],
      canOffsetY: position[1]
    });
    this._guidelineService.isActive && this._guidelineService.move(position[0], position[1]);
    this._moveData = position;
    this.emit('system.canvas.move');
    this.emit('events', {type: 'system.canvas.move'});
  }

  getZoom() {
    return this._zoomData;
  }

  getOffset() {
    return this._moveData;
  }

  getOrigin() {
    return [this._coordinateService.originX + '%', this._coordinateService.originY + '%']
  }

  getDataMap() {
    return {
      nodes: this.nodes,
      edges: this.edges,
      groups: this.groups
    };
  }

  setSelectMode(flat = true, type = ['node']) {
    if (flat) {
      this.isSelectMode = true;
      this._rmSystemUnion();
      this.selecModel = type;
      this.canvasWrapper.active();
      this._remarkMove = this.moveable;
      this._remarkZoom = this.zoomable;
      this.setZoomable(false);
      this.setMoveable(false);
    } else {
      this.isSelectMode = false;
      this.canvasWrapper.unActive();

      if (this._remarkMove) {
        this.setMoveable(true);
      }
      if (this._remarkZoom) {
        this.setZoomable(true);
      }
    }
  }

  setGirdMode(flat = true, options) {
    if (flat) {
      this._gridService.create(options);
    } else {
      this._gridService.destroy();
    }
  }

  setGuideLine(flat = true, options) {
    if (flat) {
      this._guidelineService.create(options);
    } else {
      this._guidelineService.destroy();
    }
  }

  setMinimap(flat = true, options = {}) {
    if(!options.events) {
      options.events = [];
    }

    const updateEvts = [
      'system.canvas.zoom',
      'system.node.delete',
      'system.node.move',
      'system.nodes.add',
      'system.group.delete',
      'system.group.move',
      'system.drag.move',
      'system.canvas.move',
      ...options.events
    ];

    const getNodes = () => {
      return this.nodes.map(node => {
        return {
          id: node.id,
          left: node.left,
          top: node.top,
          width: node.getWidth(),
          height: node.getHeight(),
          group: node.group,
          minimapActive: _.get(node, 'options.minimapActive')
        }
      });
    }

    const getGroups = () => {
      return this.groups.map(group => {        
        return {
          id: group.id,
          left: group.left,
          top: group.top,
          width: group.getWidth(),
          height: group.getHeight(),
          minimapActive: _.get(group, 'options.minimapActive')
        }
      });      
    }

    if(flat && !this.minimap) {
      this.minimap = new Minimap({
        root: this.root,
        move: this.move.bind(this),
        terminal2canvas: this.terminal2canvas.bind(this),
        canvas2terminal: this.canvas2terminal.bind(this),
        nodes: getNodes(),
        groups: getGroups(),
        zoom: this.getZoom(),
        offset: this.getOffset(),
        ...options
      });

      this.updateFn = () => {
        this.minimap.update({
          nodes: getNodes(),
          groups: getGroups(),
          zoom: this.getZoom(),
          offset: this.getOffset()
        });
      };
  
      for(let ev of updateEvts) {
        this.on(ev, this.updateFn);
      }

      return;
    }

    if(!this.minimap) {
      return;
    }

    this.minimap.destroy();
    for(let ev of updateEvts) {
      this.off(ev, this.updateFn);
    }

    delete this.minimap;
    delete this.updateFn;
  }

  getUnion(name) {
    if (!name) {
      console.error('传入正确的name');
      return;
    }
    return this._unionData[name];
  }

  getAllUnion() {
    return this._unionData;
  }

  add2Union(name, obj) {
    if (!name || !obj) {
      return;
    }

    if (!this._unionData[name]) {
      this._unionData[name] = {
        nodes: [],
        groups : [],
        edges: [],
        endpoints: []
      }
    }

    let _data = this._unionData[name];
    if (obj.nodes) {
      obj.nodes.forEach((item) => {
        let isId = _.isString(item);
        let node = isId ? this.getNode(item) : item;
        _data.nodes.push(node);
      });
      _data.nodes = _.uniqBy(_data.nodes, 'id');
    }

    if (obj.groups) {
      obj.groups.forEach((item) => {
        let isId = _.isString(item);
        let group = isId ? this.getGroup(item) : item;
        _data.groups.push(group);
      });
      _data.groups = _.uniqBy(_data.groups, 'id');
    }

    if (obj.edges) {
      obj.edges.forEach((item) => {
        let isId = _.isString(item);
        let edge = isId ? this.getEdge(item) : item;
        _data.edges.push(edge);
      });
      _data.edges = _.uniqBy(_data.edges, 'id');
    }

    if (obj.endpoints) {
      _data.endpoints = _data.endpoints.concat(obj.endpoints);
    }
  }

  removeUnion(name) {
    this._unionData[name] = {
      nodes: [],
      edges: [],
      groups: [],
      endpoints: []
    };
  }

  removeAllUnion() {
    this._unionData = {
      __system: {
        nodes: [],
        edges: [],
        groups: [],
        endpoints: []
      }
    };
  }

  _rmSystemUnion() {
    this._unionData['__system'].nodes = [];
    this._unionData['__system'].edges = [];
    this._unionData['__system'].groups = [];
    this._unionData['__system'].endpoints = [];
  }

  _findUnion(type, item) {
    let result = [];
    for (let key in this._unionData) {
      let isExist = _.find(_.get(this._unionData, [key, type], []), (_item) => {
        return _.toString(_item.id)  === _.toString(item.id);
      });
      if (isExist) {
        result.push(key);
      }
    }
    return result;
  }

  canvas2terminal(coordinates, options) {
    return this._coordinateService.canvas2terminal(coordinates, options);
  }
  terminal2canvas(coordinates, options) {
    return this._coordinateService.terminal2canvas(coordinates, options);
  }

  save2img(options) {
    let method = 'toPng';

    switch (options.type) {
      case 'jpeg':
      case '.jpeg':
        method = 'toJpeg';
        break;
      case 'png':
      case '.png':
        method = 'toPng';
        break;
      case 'svg':
      case '.svg':
        method = 'toSvg';
        break;
    }

    return domtoimage[method](this.root, options)
          .then(function (dataUrl) {
            return dataUrl;
          })
          .catch(function (error) {
            console.error('oops, something went wrong!', error);
          });
  }

  justifyCoordinate() {
    this._gridService.justifyAllCoordinate();
  }

  _genSvgWrapper() {
    // 生成svg的wrapper
    const svg = $(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
      .attr('class', 'butterfly-svg')
      .attr('width', '1px')
      .attr('height', '1px')
      .attr('version', '1.1')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .appendTo(this.wrapper);

      // hack 因为width和height为1的时候会有偏移
      let wrapperOffset = $(this.wrapper).offset();
      let svgOffset = svg.offset();
      svg.css('top', (wrapperOffset.top - svgOffset.top) + 'px').css('left', (wrapperOffset.left - svgOffset.left) + 'px')

    return this.svg = svg;
  }

  _genWrapper() {
    // 生成wrapper
    const wrapper = $('<div class="butterfly-wrapper"></div>')
      .appendTo(this.root);
    return this.wrapper = wrapper[0];
  }

  _genCanvasWrapper() {
    // 生成canvas wrapper
    this.canvasWrapper = new SelectCanvas();
    this.canvasWrapper.init({
      root: this.root,
      _on: this.on.bind(this),
      _emit: this.emit.bind(this)
    });
  }

  _addEventListener() {
    if (this.zoomable) {
      this.setZoomable(true);
    }
    if (this.moveable) {
      this.setMoveable(true);
    }

    let _isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    let _getChromeVersion = () => {     
      var raw = window.navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
      return raw ? parseInt(raw[2], 10) : false;
    };
    let _isHightVerChrome = _isChrome && _getChromeVersion() >= 64;

    if (_isHightVerChrome) {
      // 监听某个dom的resize事件
      const _resizeObserver = new ResizeObserver(entries => {
        this._rootWidth = $(this.root).width();
        this._rootHeight = $(this.root).height();
        this._coordinateService._changeCanvasInfo({
          terOffsetX: $(this.root).offset().left,
          terOffsetY: $(this.root).offset().top,
          terWidth: $(this.root).width(),
          terHeight: $(this.root).height()
        });
        this.canvasWrapper.resize({root: this.root});
      });
      _resizeObserver.observe(this.root);
    } else {
       //  降级处理，监控窗口的resize事件
       window.addEventListener('resize', () => {
        this._rootWidth = $(this.root).width();
        this._rootHeight = $(this.root).height();
        this._coordinateService._changeCanvasInfo({
          terOffsetX: $(this.root).offset().left,
          terOffsetY: $(this.root).offset().top,
          terWidth: $(this.root).width(),
          terHeight: $(this.root).height()
       });
       this.canvasWrapper.resize({root: this.root});
      })
    }

    // 绑定一大堆事件，group:addMember，groupDragStop，group:removeMember，beforeDetach，connection，
    this.on('InnerEvents', (data) => {
      if (data.type === 'node:addEndpoint') {
        this._addEndpoint(data.data, 'node', data.isInited);
      } else if (data.type === 'group:addEndpoint') {
        this._addEndpoint(data.data, 'group', data.isInited);
      } else if (data.type === 'node:dragBegin') {
        this._dragType = 'node:drag';
        this._dragNode = data.data;
      } else if (data.type === 'group:dragBegin') {
        this._dragType = 'group:drag';
        this._dragNode = data.data;
      } else if (data.type === 'endpoint:drag') {
        this._dragType = 'endpoint:drag';
        this._dragEndpoint = data.data;
      } else if (data.type === 'node:move') {
        this._moveNode(data.node, data.x, data.y);
      } else if (data.type === 'group:move') {
        this._moveGroup(data.group, data.x, data.y);
      }  else if (data.type === 'link:click') {
        this._dragType = 'link:click';
      } else if (data.type === 'multiple:select') {
        const result = this._selectMytiplyItem(data.range);
        // 把框选的加到union的数组
        _.assign(this._unionData['__system'], this.selectItem);

        this.emit('system.multiple.select', {
          data: result
        });
        this.emit('events', {
          type: 'multiple:select',
          data: result
        });

        this.selectItem = {
          nodes: [],
          edges: [],
          endpoints: []
        };
      } else if (data.type === 'group:resize') {
        this._dragType = 'group:resize';
        this._dragGroup = data.group;
      } else if (data.type === 'node:delete') {
        this.removeNode(data.data.id);
      } else if (data.type === 'group:delete') {
        this.removeGroup(data.data.id);
      } else if (data.type === 'group:addNodes') {
        _.get(data, 'nodes', []).forEach((item) => {
          let _hasNode = _.find(this.nodes, (_node) => {
            return item.id === _node.id;
          });
          if (!_hasNode) {
            this.addNode(item);
          } else {
            let neighborEdges = [];
            let rmItem = this.removeNode(item.id, true, true);
            let rmNode = rmItem.nodes[0];
            neighborEdges = rmItem.edges;
            rmNode._init({
              top: item.top,
              left: item.left,
              dom: rmNode.dom,
              group: data.group.id
            });
            this.addNode(rmNode, true);
            neighborEdges.forEach((item) => {
              item.redraw();
            });
          }
        });
        this.emit('events', {
          type: 'system.group.addMembers',
          nodes: data.nodes,
          group: data.group
        });
        this.emit('system.group.addMembers', {
          nodes: data.nodes,
          group: data.group
        });
      } else if (data.type === 'group:removeNodes') {
        _.get(data, 'nodes', []).forEach((item) => {
          let _nodeIndex = _.findIndex(this.nodes, (_node) => {
            return item.id === _node.id;
          });
          if (_nodeIndex !== -1) {
            this.nodes.splice(_nodeIndex, 1);
          }
        });
      }
    });

    // 绑定拖动事件
    this._attachMouseDownEvent();
  }

  _isExistNode(node) {
    const hasNodes = this.nodes.filter(item => item.id === node.id);
    return hasNodes.length > 0;
  }

  _isExistGroup(group) {
    const hasGroups = this.groups.filter(item => item.id === group.id);
    return hasGroups.length > 0;
  }

  _addEndpoint(endpoint, type, isInited) {
    let initOtps = {
      nodeType: type,
      _coordinateService: this._coordinateService
    };
    endpoint._init(initOtps);

    // 非自定义dom，自定义dom不需要定位
    if (!endpoint._isInitedDom) {
      const endpointDom = endpoint.dom;
      if (_.get(endpoint, '_node.group')) {
        const group = this.getGroup(endpoint._node.group);
        $(group.dom).append(endpointDom);
      } else {
        $(this.wrapper).prepend(endpointDom);
      }
      endpoint.updatePos();
    }
    endpoint.mounted && endpoint.mounted();
  }

  _attachMouseDownEvent() {
    let canvasOriginPos = {
      x: 0,
      y: 0
    };
    let nodeOriginPos = {
      x: 0,
      y: 0
    };

    let _isActiveEndpoint = false;
    let _activeItems = [];
    // 把其他可连接的point高亮
    let _activeLinkableEndpoint = (target) => {
      if (_isActiveEndpoint) {
        return;
      }
      let _allPoints = this._getAllEndpoints();
      _allPoints.forEach((_point) => {
        if (target === _point || _point.type === 'source' || _point._tmpType === 'source') {
          return;
        }
        if (_point.canLink && _point.canLink(target)) {
          if (_point.linkable) {
            _point.linkable();
            _point._linkable = true;
          }
          return;
        }
        if (ScopeCompare(target.scope, _point.scope)) {
          if (_point.linkable) {
            _point.linkable();
            _point._linkable = true;
          }
          _activeItems.push(_point);
          return;
        }
      });
      _isActiveEndpoint = true;
    };
    // 把其他可连接的point取消高亮
    let _unActiveLinkableEndpoint = () => {
      _isActiveEndpoint = false;
      _activeItems.forEach((item) => {
        item.unLinkable && item.unLinkable();
        item.unHoverLinkable && item.unHoverLinkable();
        item._linkable = false;
      });
      _activeItems = [];
    };


    let _oldFocusPoint = null;
    let _isFocusing = false;
    // 检查鼠标是否在可连的锚点上
    let _focusLinkableEndpoint = (cx, cy) => {
      if (!_isFocusing) {
        // if (_focusPoint) {
        //   _focusPoint.unHoverLinkable && _focusPoint.unHoverLinkable();
        //   _focusPoint = null;
        // }
        _isFocusing = true;
        setTimeout(() => {
          let _points = this._getAllEndpoints();
          let x = this._coordinateService._terminal2canvas('x', cx);
          let y = this._coordinateService._terminal2canvas('y', cy);
          let _focusPoint = null;
          _points.forEach((_point) => {
            const _maxX = _point._posLeft + _point._width + (_.get(_point, 'expandArea.right') || this.theme.endpoint.expandArea.right);
            const _maxY = _point._posTop + _point._height + (_.get(_point, 'expandArea.bottom') || this.theme.endpoint.expandArea.bottom);
            const _minX = _point._posLeft - (_.get(_point, 'expandArea.left') || this.theme.endpoint.expandArea.left);
            const _minY = _point._posTop - (_.get(_point, 'expandArea.top') || this.theme.endpoint.expandArea.top);
            if (x > _minX && x < _maxX && y > _minY && y < _maxY) {
              _focusPoint = _point;
            }
          });
          if (_focusPoint) {
            if (_focusPoint !== _oldFocusPoint) {
              _focusPoint.hoverLinkable && _focusPoint.hoverLinkable();
              _oldFocusPoint = _focusPoint;
            }
          } else {
            if (_oldFocusPoint) {
              _oldFocusPoint.unHoverLinkable && _oldFocusPoint.unHoverLinkable();
              _oldFocusPoint = null;
            }
          }
          _isFocusing = false;
        }, 100);
      }
    };

    const mouseDownEvent = (event) => {
      const LEFT_BUTTON = 0;
      if (event.button !== LEFT_BUTTON) {
        return;
      }

      if (!this._dragType && this.moveable) {
        this._dragType = 'canvas:drag';
      }

      // 假如点击在空白地方且在框选模式下
      if ((event.target === this.svg[0] || event.target === this.root) && this.isSelectMode) {
        this.canvasWrapper.active();
        this.canvasWrapper.dom.dispatchEvent(new MouseEvent('mousedown', {
          clientX: event.clientX,
          clientY: event.clientY
        }));
        return;
      }

      canvasOriginPos = {
        x: event.clientX,
        y: event.clientY
      };

      this.emit('system.drag.start', {
        dragType: this._dragType,
        dragNode: this._dragNode,
        dragEndpoint: this._dragEndpoint,
        dragEdges: this._dragEdges,
        dragGroup: this._dragGroup,
        position: {
          clientX: event.clientX,
          clientY: event.clientY,
          canvasX: this._coordinateService._terminal2canvas('x', event.clientX),
          canvasY: this._coordinateService._terminal2canvas('y', event.clientY)
        }
      });
      this.emit('events', {
        type: 'drag:start',
        dragType: this._dragType,
        dragNode: this._dragNode,
        dragEndpoint: this._dragEndpoint,
        dragEdges: this._dragEdges,
        dragGroup: this._dragGroup,
        position: {
          clientX: event.clientX,
          clientY: event.clientY,
          canvasX: this._coordinateService._terminal2canvas('x', event.clientX),
          canvasY: this._coordinateService._terminal2canvas('y', event.clientY)
        }
      });
    };

    const mouseMoveEvent = (event) => {
      const LEFT_BUTTON = 0;
      if (event.button !== LEFT_BUTTON) {
        return;
      }
      if (this._dragType) {
        const canvasX = this._coordinateService._terminal2canvas('x', event.clientX);
        const canvasY = this._coordinateService._terminal2canvas('y', event.clientY);
        const offsetX = event.clientX - canvasOriginPos.x;
        const offsetY = event.clientY - canvasOriginPos.y;
        if (this._dragType === 'canvas:drag') {
          this.move([offsetX + this._moveData[0], offsetY + this._moveData[1]]);
          canvasOriginPos = {
            x: event.clientX,
            y: event.clientY
          };
        } else if (this._dragType === 'node:drag') {
          if (nodeOriginPos.x === 0 && nodeOriginPos.y === 0) {
            nodeOriginPos = {
              x: canvasX,
              y: canvasY
            };
            return;
          }
          if (this._dragNode) {
            let moveNodes = [this._dragNode];
            const unionKeys = this._findUnion('nodes', this._dragNode);
            if (unionKeys && unionKeys.length > 0) {
              unionKeys.forEach((key) => {
                moveNodes = moveNodes.concat(this._unionData[key].nodes);
              });
              moveNodes = _.uniqBy(moveNodes, 'id');
            } else {
              this._rmSystemUnion();
            }
            $(this.svg).css('visibility', 'hidden');
            $(this.wrapper).css('visibility', 'hidden');
            moveNodes.forEach((node) => {
              this._moveNode(node, node.left + (canvasX - nodeOriginPos.x), node.top + (canvasY - nodeOriginPos.y));
              if (this._guidelineService.isActive) {
                this._guidelineService.draw(node, 'node');
              }
            });
            $(this.svg).css('visibility', 'visible');
            $(this.wrapper).css('visibility', 'visible');
            nodeOriginPos = {
              x: canvasX,
              y: canvasY
            };
            this.emit('system.node.move', {
              nodes: moveNodes
            });
            this.emit('events', {
              type: 'node:move',
              nodes: moveNodes
            });
          }
        } else if (this._dragType === 'group:drag') {
          if (nodeOriginPos.x === 0 && nodeOriginPos.y === 0) {
            nodeOriginPos = {
              x: canvasX,
              y: canvasY
            };
            return;
          }
          if (this._dragNode) {
            $(this.svg).css('visibility', 'hidden');
            $(this.wrapper).css('visibility', 'hidden');
            const group = this._dragNode;
            this._moveGroup(group, group.left + (canvasX - nodeOriginPos.x),  group.top + (canvasY - nodeOriginPos.y));
            if (this._guidelineService.isActive) {
              this._guidelineService.draw(group, 'group');
            }
            $(this.svg).css('visibility', 'visible');
            $(this.wrapper).css('visibility', 'visible');
            nodeOriginPos = {
              x: canvasX,
              y: canvasY
            };
            this.emit('system.group.move', {
              group: group
            });
            this.emit('events', {
              type: 'group:move',
              group: group
            });
          }
        } else if (this._dragType === 'endpoint:drag') {
          const endX = this._coordinateService._terminal2canvas('x', event.clientX);
          const endY = this._coordinateService._terminal2canvas('y', event.clientY);

          // 明确标记source或者是没有type且没有线连上
          let _isSourceEndpoint = (this._dragEndpoint.type === 'source' || (!this._dragEndpoint.type && (!this._dragEndpoint._tmpType || this._dragEndpoint._tmpType === 'source')));
          let _isTargetEndpoint = (this._dragEndpoint.type === 'target' || (!this._dragEndpoint.type && this._dragEndpoint._tmpType === 'target'));
          
          if (_isSourceEndpoint && this.linkable) {
            let unionKeys = this._findUnion('endpoints', this._dragEndpoint);
            
            let edges = [];
            if (!this._dragEdges || this._dragEdges.length === 0) {
              const EdgeClass = this.theme.edge.Class;
              let endpoints = [];
              if (unionKeys && unionKeys.length > 0) {
                unionKeys.forEach((key) => {
                  endpoints = endpoints.concat(this._unionData[key].endpoints);
                });
                endpoints = _.uniqBy(endpoints, (_point) => { return _point.nodeId + '||' + _point.id });
              } else {
                endpoints = [this._dragEndpoint];
              }
              endpoints.forEach((point) => {
                let pointObj = {
                  type: 'endpoint',
                  shapeType: this.theme.edge.type,
                  orientationLimit: this.theme.endpoint.position,
                  _sourceType: point.nodeType,
                  sourceNode: point.nodeType === 'node' ? this.getNode(point.nodeId) : this.getGroup(point.nodeId),
                  sourceEndpoint: point,
                  arrow: this.theme.edge.arrow,
                  arrowPosition:  this.theme.edge.arrowPosition,
                  arrowOffset:  this.theme.edge.arrowOffset,
                  label: this.theme.edge.label,
                  isExpandWidth: this.theme.edge.isExpandWidth
                };
                // 检查endpoint限制连接数目
                let _linkNums = this.edges.filter((_edge) => {
                  return _edge.sourceEndpoint.id === point.id;
                }).length + 1;
                if (_linkNums > point.limitNum) {
                  console.warn(`id为${point.id}的锚点限制了${point.limitNum}条连线`);
                  return ;
                }
                let _newEdge = new EdgeClass(_.assign(pointObj, {
                  _global: this.global,
                  _on: this.on.bind(this),
                  _emit: this.emit.bind(this),
                }));
                _newEdge._init();
                $(this.svg).append(_newEdge.dom);
                if (_newEdge.labelDom) {
                  $(this.wrapper).append(_newEdge.labelDom);
                }
                if (_newEdge.arrowDom) {
                  $(this.svg).append(_newEdge.arrowDom);
                }
                edges.push(_newEdge);
              });
              this._dragEdges = edges;
            } else {
              edges = this._dragEdges;
            }

            $(this.svg).css('visibility', 'hidden');
            $(this.wrapper).css('visibility', 'hidden');
            edges.forEach((edge) => {
              let beginX =  edge.sourceEndpoint._posLeft + edge.sourceEndpoint._width / 2;
              let beginY = edge.sourceEndpoint._posTop + edge.sourceEndpoint._height / 2;
              const _soucePoint = {
                pos: [beginX, beginY],
                orientation: edge.sourceEndpoint.orientation
              };
              const _targetPoint = {
                pos: [endX, endY],
              };
              edge.redraw(_soucePoint, _targetPoint);
            });
            $(this.svg).css('visibility', 'visible');
            $(this.wrapper).css('visibility', 'visible');

            if (this.theme.endpoint.linkableHighlight) {
              _activeLinkableEndpoint(this._dragEndpoint);
              _focusLinkableEndpoint(event.clientX, event.clientY);
            }

            this.emit('system.drag.move', {
              dragType: this._dragType,
              pos: [event.clientX, event.clientY],
              dragNode: this._dragNode,
              dragEndpoint: this._dragEndpoint,
              dragEdges: edges
            });
            this.emit('events', {
              type: 'drag:move',
              dragType: this._dragType,
              pos: [event.clientX, event.clientY],
              dragNode: this._dragNode,
              dragEndpoint: this._dragEndpoint,
              dragEdges: edges
            });
          } else if (_isTargetEndpoint && this.disLinkable) {
            // 从后面搜索线
            let targetEdge = null;
            for (let i = this.edges.length - 1; i >= 0; i--) {
              if (this._dragEndpoint.id === _.get(this.edges, [i, 'targetEndpoint', 'id']) && this._dragEndpoint.nodeId === _.get(this.edges, [i, 'targetNode', 'id'])) {
                targetEdge = this.edges[i];
                break;
              }
            }
            if (targetEdge && this._dragEdges.length === 0) {
              targetEdge._isDeletingEdge = true;
              this._dragEdges = [targetEdge];
            }

            if (this._dragEdges.length !== 0) {
              let edge = this._dragEdges[0];
              let beginX =  edge.sourceEndpoint._posLeft + edge.sourceEndpoint._width / 2;
              let beginY = edge.sourceEndpoint._posTop + edge.sourceEndpoint._height / 2;
              const _soucePoint = {
                pos: [beginX, beginY],
                orientation: edge.sourceEndpoint.orientation
              };
              const _targetPoint = {
                pos: [endX, endY],
              };
              edge.redraw(_soucePoint, _targetPoint);
            }
            if (this.theme.endpoint.linkableHighlight) {
              _activeLinkableEndpoint(this._dragEndpoint);
              _focusLinkableEndpoint(event.clientX, event.clientY);
            }
          }
        } else if (this._dragType === 'group:resize') {
          let canvasX = this._coordinateService._terminal2canvas('x', event.clientX);
          let canvasY = this._coordinateService._terminal2canvas('y', event.clientY);

          let _newWidth = canvasX - this._dragGroup.left;
          let _newHeight = canvasY - this._dragGroup.top;
          this._dragGroup.setSize(_newWidth, _newHeight);
        }
      }
    };

    const mouseEndEvent = (event) => {
      const LEFT_BUTTON = 0;
      if (event.button !== LEFT_BUTTON) {
        return;
      }

      _unActiveLinkableEndpoint();

      // 处理线条的问题
      if (this._dragType === 'endpoint:drag' && this._dragEdges && this._dragEdges.length !== 0) {
        // 释放对应画布上的x,y
        const x = this._coordinateService._terminal2canvas('x', event.clientX);
        const y = this._coordinateService._terminal2canvas('y', event.clientY);

        let _targetEndpoint = null;

        let _nodes = _.concat(this.nodes, this.groups);
        _nodes.forEach((_node) => {
          if (_node.endpoints) {
            _node.endpoints.forEach((_point) => {
              const _maxX = _point._posLeft + _point._width + (_.get(_point, 'expandArea.right') || this.theme.endpoint.expandArea.right);
              const _maxY = _point._posTop + _point._height + (_.get(_point, 'expandArea.bottom') || this.theme.endpoint.expandArea.bottom);
              const _minX = _point._posLeft - (_.get(_point, 'expandArea.left') || this.theme.endpoint.expandArea.left);
              const _minY = _point._posTop - (_.get(_point, 'expandArea.top') || this.theme.endpoint.expandArea.top);
              if (x > _minX && x < _maxX && y > _minY && y < _maxY) {
                _targetEndpoint = _point;
              }
            });
          }
        });

        let isDestoryEdges = false;
        // 找不到点 或者 目标节点不是target
        if (!_targetEndpoint || _targetEndpoint.type === 'source' || _targetEndpoint._tmpType === 'source') {
          isDestoryEdges = true;
        }

        // scope不同
        if (!isDestoryEdges) {
          isDestoryEdges = _.some(this._dragEdges, (edge) => {
            return !ScopeCompare(edge.sourceEndpoint.scope, _targetEndpoint.scope, _.get(this, 'global.isScopeStrict'));
          });
        }

        // 检查endpoint限制连接数目
        if (_targetEndpoint && _targetEndpoint.limitNum !== undefined) {
          let _linkNum = this.edges.filter((_edge) => {
            return _edge.targetEndpoint.id === _targetEndpoint.id;
          }).length + this._dragEdges.length;
          if (_linkNum > _targetEndpoint.limitNum) {
            console.warn(`id为${_targetEndpoint.id}的锚点限制了${_targetEndpoint.limitNum}条连线`);
            isDestoryEdges = true;
          }
        }

        if (isDestoryEdges) {
          this._dragEdges.forEach((edge) => {
            if (edge._isDeletingEdge) {
              this.removeEdge(edge);
            } else {
              edge.destroy(!edge._isDeletingEdge);
            }
          });
          // 把endpoint重新赋值
          this._dragEdges.forEach((_rmEdge) => {
            if (_.get(_rmEdge, 'sourceEndpoint._tmpType') === 'source') {
              let isExistEdge = _.some(this.edges, (edge) => {
                return _rmEdge.sourceNode.id === edge.sourceNode.id && _rmEdge.sourceEndpoint.id === edge.sourceEndpoint.id;
              });
              !isExistEdge && (_rmEdge.sourceEndpoint._tmpType = undefined);
            }
            if (_.get(_rmEdge, 'targetEndpoint._tmpType') === 'target') {
              let isExistEdge = _.some(this.edges, (edge) => {
                return _rmEdge.targetNode.id === edge.targetNode.id && _rmEdge.targetEndpoint.id === edge.targetEndpoint.id;
              });
              !isExistEdge && (_rmEdge.targetEndpoint._tmpType = undefined);
            }
          });
        } else {
          let _delEdges = [];
          let _emitEdges = this._dragEdges.filter((edge) => {
            // 线条去重
            if (!this.theme.edge.isRepeat) {
              let _isRepeat = _.some(this.edges, (_edge) => {
                let _result = false;
                if (edge.sourceNode) {
                  if (_edge.type === 'node') {
                    _result = edge.sourceNode.id === _edge.sourceNode.id;
                  } else {
                    _result = edge.sourceNode.id === _edge.sourceNode.id && edge.sourceEndpoint.id === _edge.sourceEndpoint.id;
                  }
                }
                
                if (_targetEndpoint.nodeId) {
                  if (_edge.type === 'node') {
                    _result = _result && (_.get(edge, 'targetNode.id') === _.get(_edge, 'targetNode.id'));
                  } else {
                    _result = _result && (_targetEndpoint.nodeId === _.get(_edge, 'targetNode.id') && _targetEndpoint.id === _.get(_edge, 'targetEndpoint.id')); 
                  }
                }

                if (_result && edge._isDeletingEdge) {
                  _result = false;
                }

                return _result;
              });
              if (_isRepeat) {
                console.warn(`id为${edge.sourceEndpoint.id}-${_targetEndpoint.id}的线条连接重复，请检查`);
                edge.destroy();
                return false;
              }
            }
            let _preTargetNodeId = _.get(edge, 'targetNode.id');
            let _preTargetPointId = _.get(edge, 'targetEndpoint.id');
            let _currentTargetNode = _targetEndpoint.nodeType === 'node' ? this.getNode(_targetEndpoint.nodeId) : this.getGroup(_targetEndpoint.nodeId);
            let _currentTargetEndpoint = _targetEndpoint;
            if (_preTargetNodeId && _preTargetPointId && `${_preTargetNodeId}||${_preTargetPointId}` !== `${_currentTargetNode}||${_currentTargetEndpoint}`) {
              _delEdges.push(_.cloneDeep(edge));
            }
            edge._create({
              id: edge.id && !edge._isDeletingEdge ? edge.id : `${edge.sourceEndpoint.id}-${_targetEndpoint.id}`,
              targetNode: _currentTargetNode,
              _targetType: _targetEndpoint.nodeType,
              targetEndpoint: _currentTargetEndpoint,
              type: 'endpoint'
            });
            let _isConnect = edge.isConnect ? edge.isConnect() : true;
            if (!_isConnect) {
              console.warn(`id为${edge.sourceEndpoint.id}-${_targetEndpoint.id}的线条无法连接，请检查`);
              edge.destroy();
              return false;
            }
            
            // 正在删除的线重新连接
            if (edge._isDeletingEdge) {
              delete edge._isDeletingEdge;
            } else {
              edge.mounted && edge.mounted();
              this.edges.push(edge);
            }

            // 把endpoint重新赋值
            if (edge.type === 'endpoint' && !_.get(edge, 'sourceEndpoint.type') && !_.get(edge, 'sourceEndpoint._tmpType')) {
              edge.sourceEndpoint._tmpType = 'source';
            }
            if (edge.type === 'endpoint' && !_.get(edge, 'targetEndpoint.type') && !_.get(edge, 'targetEndpoint._tmpType')) { 
              edge.targetEndpoint._tmpType = 'target';
            }
            
            return edge;
          });
          if (_delEdges.length !== 0 && _emitEdges.length !== 0) {
            this.emit('system.link.reconnect', {
              delLinks: _delEdges,
              addLinks: _emitEdges
            });
            this.emit('events', {
              type: 'link:reconnect',
              delLinks: _delEdges,
              addLinks: _emitEdges
            });
          } else {
            if (_delEdges.length !== 0) {
              _delEdges.forEach((_edge) => {
                this.emit('system.link.delete', {
                  link: _edge
                });
                this.emit('events', {
                  type: 'link:delete',
                  link: _edge
                });
              });
            }
            if (_emitEdges.length !== 0) {
              this.emit('system.link.connect', {
                links: this._dragEdges
              });
              this.emit('events', {
                type: 'link:connect',
                links: this._dragEdges
              });
            }
          }
        }
      }
      if (this._dragType === 'node:drag' && this._dragNode) {

        let _handleDragNode = (dragNode) => {
          let sourceGroup = null;
          let targetGroup = null;
          let _nodeLeft = dragNode.left;
          let _nodeRight = dragNode.left + dragNode.getWidth();
          let _nodeTop = dragNode.top;
          let _nodeBottom = dragNode.top + dragNode.getHeight();

          if (dragNode.group) {
            const _group = this.getGroup(dragNode.group);
            const _groupLeft = _group.left;
            const _groupTop = _group.top;
            if (_nodeRight < 0 || _nodeLeft > _group.getWidth() || _nodeBottom < 0 || _nodeTop > _group.getHeight()) {
              _nodeLeft += _groupLeft;
              _nodeTop += _groupTop;
              _nodeRight += _groupLeft;
              _nodeBottom += _groupTop;
              sourceGroup = _group;
            } else {
              sourceGroup = _group;
              targetGroup = _group;
            }
          }

          if (!targetGroup) {
            for (let i = 0; i < this.groups.length; i++) {
              const _group = this.groups[i];
              const _groupLeft = _group.left;
              const _groupRight = _group.left + _group.getWidth();
              const _groupTop = _group.top;
              const _groupBottom = _group.top + _group.getHeight();
              if (_groupLeft <= _nodeLeft && _groupRight >= _nodeRight && _groupTop <= _nodeTop && _groupBottom >= _nodeBottom) {
                if (_group.id !== dragNode.group) {
                  targetGroup = _group;
                  break;
                }
              }
            }
          }

          let neighborEdges = [];

          // 更新edge里面的字段，以防外面操作了里面dom
          let _updateNeighborEdge = (node, neighborEdges) => {
            neighborEdges.forEach((_edge) => {
              if (_edge.sourceNode.id === node.id) {
                _edge.sourceNode = node;
                let _sourceEndpoint = _.find(_edge.sourceNode.endpoints, (_point) => {
                  return _edge.sourceEndpoint.id === _point.id;
                });
                _edge.sourceEndpoint = _sourceEndpoint;
              }
              if (_edge.targetNode.id === node.id) {
                _edge.targetNode = node;
                let _targetEndpoint = _.find(_edge.targetNode.endpoints, (_point) => {
                  return _edge.targetEndpoint.id === _point.id;
                });
                _edge.targetEndpoint = _targetEndpoint;
              }
            });
          };

          if (sourceGroup) {
            // 从源组拖动到目标组
            if (sourceGroup !== targetGroup) {
              const rmItem = this.removeNode(dragNode.id, true, true);
              const rmNode = rmItem.nodes[0];
              neighborEdges = rmItem.edges;
              const nodeData = {
                id: rmNode.id,
                top: _nodeTop,
                left: _nodeLeft,
                dom: rmNode.dom,
                _isDeleteGroup: true
              };

              this.emit('events', {
                type: 'system.group.removeMembers',
                group: sourceGroup,
                nodes: [rmNode]
              });
              this.emit('system.group.removeMembers', {
                group: sourceGroup,
                nodes: [rmNode]
              });

              if (targetGroup) {
                if (ScopeCompare(dragNode.scope, targetGroup.scope, _.get(this, 'global.isScopeStrict'))) {
                  nodeData.top -= targetGroup.top;
                  nodeData.left -= targetGroup.left;
                  nodeData.group = targetGroup.id;
                  nodeData._isDeleteGroup = false;
                  this.emit('events', {
                    type: 'system.group.addMembers',
                    nodes: [rmNode],
                    group: targetGroup
                  });
                  this.emit('system.group.addMembers', {
                    nodes: [rmNode],
                    group: targetGroup
                  });
                } else {
                  console.warn(`nodeId为${dragNode.id}的节点和groupId${targetGroup.id}的节点组scope值不符，无法加入`);
                }
              }
              rmNode._init(nodeData);
              this.addNode(rmNode, true);
              _updateNeighborEdge(rmNode, neighborEdges);
            }
          } else {
            if (targetGroup) {
              if (ScopeCompare(dragNode.scope, targetGroup.scope, _.get(this, 'global.isScopeStrict'))) {
                const rmItem = this.removeNode(dragNode.id, true, true);
                const rmNode = rmItem.nodes[0];
                neighborEdges = rmItem.edges;
                rmNode._init({
                  top: _nodeTop - targetGroup.top,
                  left: _nodeLeft - targetGroup.left,
                  dom: rmNode.dom,
                  group: targetGroup.id
                });
                this.addNode(rmNode, true);
                this.emit('events', {
                  type: 'system.group.addMembers',
                  nodes: [rmNode],
                  group: targetGroup
                });
                this.emit('system.group.addMembers', {
                  nodes: [rmNode],
                  group: targetGroup
                });
                _updateNeighborEdge(rmNode, neighborEdges);
              } else {
                console.warn(`nodeId为${dragNode.id}的节点和groupId${targetGroup.id}的节点组scope值不符，无法加入`);
              }
            }
          }
          neighborEdges.forEach((item) => {
            item.redraw();
          });
          dragNode.endpoints.forEach((item) => {
            item.updatePos && item.updatePos();
          });
          dragNode._isMoving = false;
        }
        let moveNodes = [this._dragNode];
        const unionKeys = this._findUnion('nodes', this._dragNode);
        if (unionKeys && unionKeys.length > 0) {
          unionKeys.forEach((key) => {
            moveNodes = moveNodes.concat(this._unionData[key].nodes);
          });
          moveNodes = _.uniqBy(moveNodes, 'id');
        }
        moveNodes.forEach((dragNode) => {
          _handleDragNode(dragNode);
        });
        this._rmSystemUnion();
      }

      // 节点组放大缩小
      if (this._dragType === 'group:resize' && this._dragGroup) {
        this.emit('events', {
          type: 'system.group.resize',
          group: this._dragGroup
        });
        this.emit('system.group.resize', {
          group: this._dragGroup
        });
      }

      // 点击空白处触发canvas click，并且框选模式下不触发
      if ((this._dragType === 'canvas:drag' || !this._dragType) && !this.isSelectMode) {
        this.emit('system.canvas.click');
        this.emit('events', {
          type: 'canvas:click'
        });
      }

      this.emit('system.drag.end', {
        dragType: this._dragType,
        dragNode: this._dragNode,
        dragEndpoint: this._dragEndpoint,
        dragEdges: this._dragEdges,
        dragGroup: this._dragGroup,
      });
      this.emit('events', {
        type: 'drag:end',
        dragType: this._dragType,
        dragNode: this._dragNode,
        dragEndpoint: this._dragEndpoint,
        dragEdges: this._dragEdges,
        dragGroup: this._dragGroup,
      });

      this._dragType = null;
      this._dragNode = null;
      this._dragEndpoint = null;
      this._dragGroup = null;
      this._dragEdges = [];
      nodeOriginPos = {
        x: 0,
        y: 0
      };
      canvasOriginPos = {
        x: 0,
        y: 0
      };
      this._guidelineService.isActive && this._guidelineService.clearCanvas();
    };


    this.root.addEventListener('mousedown', mouseDownEvent);
    this.root.addEventListener('mousemove', mouseMoveEvent);
    // this.root.addEventListener('mouseleave', mouseEndEvent);
    this.root.addEventListener('mouseup', mouseEndEvent);
  }
  _moveNode(node, x, y) {
    node._moveTo(x, y);
    this.edges.forEach((edge) => {
      if (edge.type === 'endpoint') {
        const isLink = _.find(node.endpoints, (point) => {
          return (point.nodeId === edge.sourceNode.id && !!edge.sourceNode.getEndpoint(point.id, 'source')) || (point.nodeId === edge.targetNode.id && !!edge.targetNode.getEndpoint(point.id, 'target'));
        });
        isLink && edge.redraw();
      } else if (edge.type === 'node') {
        const isLink = edge.sourceNode.id === node.id || edge.targetNode.id === node.id;
        isLink && edge.redraw();
      }
    });
  }
  _moveGroup(group, x, y) {
    group._moveTo(x, y);
    this.edges.forEach((edge) => {
      let hasUpdate = _.get(edge, 'sourceNode.group') === group.id ||
        _.get(edge, 'targetNode.group') === group.id ||
        (_.get(edge, '_sourceType') === 'group' && _.get(edge, 'sourceNode.id') === group.id) ||
        (_.get(edge, '_targetType') === 'group' && _.get(edge, 'targetNode.id') === group.id);

      hasUpdate && (edge.redraw());
    });
  }
  _autoLayout(data) {
    const width = this._rootWidth;
    const height = this._rootHeight;

    if (_.isFunction(this.layout)) {
      this.layout({
        width: width,
        height: height,
        data: data
      });
    } else {
      // 重力布局
      if (_.get(this.layout, 'type') === 'forceLayout') {
        const _opts = $.extend({
          // 布局画布总宽度
          width,
          // 布局画布总长度
          height,
          // 布局相对中心点
          center: {
            x: width / 2,
            y: height / 2
          },
          // 节点互斥力，像电荷原理一样
          chargeStrength: -150,
          link: {
            // 以node的什么字段为寻找id，跟d3原理一样
            id: 'id',
            // 线条的距离
            distance: 200,
            // 线条的粗细
            strength: 1
          }
        }, _.get(this.layout, 'options'), true);

        // 自动布局
        if (_.get(this.layout, 'type') === 'forceLayout') {
          Layout.forceLayout({
            opts: _opts,
            data: {
              groups: data.groups,
              nodes: data.nodes,
              // 加工线条数据，兼容endpoint为id的属性，d3没这个概念
              edges: data.edges.map(item => ({
                source: item.type === 'endpoint' ? item.sourceNode : item.source,
                target: item.type === 'endpoint' ? item.targetNode : item.target
              }))
            }
          });
        }
      }
    }
  }
  _selectMytiplyItem(range) {
    // 确认一下终端的偏移值
    const startX = this._coordinateService._terminal2canvas('x', range[0]);
    const startY = this._coordinateService._terminal2canvas('y', range[1]);
    const endX = this._coordinateService._terminal2canvas('x', range[2]);
    const endY = this._coordinateService._terminal2canvas('y', range[3]);

    const includeNode = _.includes(this.selecModel, 'node');
    const includeEdge = _.includes(this.selecModel, 'edge');
    const includeEndpoint = _.includes(this.selecModel, 'endpoint');
    // 框选节点
    if (includeNode) {
      this.nodes.forEach((item) => {
        const nodeLeft = item.left;
        const nodeRight = item.left + $(item.dom).width();
        const nodeTop = item.top;
        const nodeBottom = item.top + $(item.dom).height();
        if (startX < nodeLeft && endX > nodeRight && startY < nodeTop && endY > nodeBottom) {
          this.selectItem.nodes.push(item);
        }
      });
    }

    // 框选锚点
    if (includeEndpoint) {
      this.nodes.forEach((node) => {
        node.endpoints.forEach((item) => {
          const pointLeft = item._posLeft;
          const pointRight = item._posLeft + $(item.dom).width();
          const pointTop = item._posTop;
          const pointBottom = item._posTop + $(item.dom).height();
          if (startX < pointLeft && endX > pointRight && startY < pointTop && endY > pointBottom) {
            this.selectItem.endpoints.push(item);
          }
        });
      });
    }

    // 框选线条
    if (includeEdge) {
      this.edges.forEach((item) => {
        if (item.type === 'endpoint') {
          const left = item.sourceEndpoint._posLeft < item.targetEndpoint._posLeft ? item.sourceEndpoint._posLeft : item.targetEndpoint._posLeft;
          const right = (item.sourceEndpoint._posLeft + item.sourceEndpoint._width) > (item.targetEndpoint._posLeft + item.targetEndpoint._width) ? (item.sourceEndpoint._posLeft + item.sourceEndpoint._width) : (item.targetEndpoint._posLeft + item.targetEndpoint._width);
          const top = item.sourceEndpoint._posTop < item.targetEndpoint._posTop ? item.sourceEndpoint._posTop : item.targetEndpoint._posTop;
          const bottom = (item.sourceEndpoint._posTop + item.sourceEndpoint._height) > (item.targetEndpoint._posTop + item.targetEndpoint._height) ? (item.sourceEndpoint._posTop + item.sourceEndpoint._height) : (item.targetEndpoint._posTop + item.targetEndpoint._height);
          if (startX < left && endX > right && startY < top && endY > bottom) {
            this.selectItem.edges.push(item);
          }
        } else if (item.type === 'node') {
          // 后续补
        }
      });
    }

    // 框选节点组，准备支持

    return this.selectItem;
  }
  _getAllEndpoints() {
    let points = [];
    points = points.concat(this.nodes.map((_node) => {
      return _node.endpoints;
    }));
    points = points.concat(this.groups.map((_node) => {
      return _node.endpoints;
    }));
    points = points.filter((item) => {
      return !!item;
    });
    return _.flatten(points);
  }
}

export default BaseCanvas;
