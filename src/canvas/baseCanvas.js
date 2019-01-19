

const $ = require('jquery');
const _ = require('lodash');
const Canvas = require('../interface/canvas');
const Node = require('../node/baseNode');
const Edge = require('../edge/baseEdge');
const Group = require('../group/baseGroup');
const Layout = require('../utils/layout');
const SelectCanvas = require('../utils/selectCanvas');
// 画布和屏幕坐标地换算
const CoordinateService = require('../utils/coordinate');

require('./baseCanvas.less');

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
        isRepeat: _.get(options, 'theme.edge.isRepeat') || false,
        isLinkMyself: _.get(options, 'theme.edge.isLinkMyself') || false,
      },
      endpoint: {
        position: _.get(options, 'theme.endpoint.position')
      }
    };

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
    this.warpper = null;
    this.canvasWarpper = null;
    // 加一层warpper方便处理缩放，平移
    this._genWarpper();
    // 加一层svg画线条
    this._genSvgWarpper();
    // 加一层canvas方便处理辅助
    this._genCanvasWarpper();

    // 统一处理画布拖动事件
    this._dragType = null;
    this._dragNode = null;
    this._dragEndpoint = null;
    this._dragEdges = [];
    this._dragGroup = null;

    // 初始化一些参数
    this._rootOffsetX = $(this.root).offset().left;
    this._rootOffsetY = $(this.root).offset().top;
    this._rootWidth = $(this.root).width();
    this._rootHeight = $(this.root).height();

    this._coordinateService = new CoordinateService({
      terOffsetX: $(this.root).offset().left,
      terOffsetY: $(this.root).offset().top,
      terWidth: $(this.root).width(),
      terHeight: $(this.root).height(),
      canOffsetX: this._moveData[0],
      canOffsetY: this._moveData[1],
      scale: this._zoomData
    });

    this._addEventLinster();

    this.unionItem = {
      nodes: [],
      edges: [],
      groups: [],
      endpoints: []
    };
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
      callback && callback();
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

  addGroup(group) {
    const container = $(this.warpper);
    const GroupClass = group.Class || Group;
    const _groupObj = new GroupClass(_.assign(_.cloneDeep(group), {
      _emit: this.emit.bind(this),
      _on: this.on.bind(this),
    }));
    if (this._isExistGroup(_groupObj)) {
      // 后续用新的group代码旧的group
      console.log(`group:${_groupObj.id} has existed`);
      return;
    }
    _groupObj.init();
    container.prepend(_groupObj.dom);

    this.groups.push(_groupObj);

    _groupObj.mounted && _groupObj.mounted();
    return _groupObj;
  }

  addNodes(nodes, isNotEventEmit) {
    const _canvasFragment = document.createDocumentFragment();
    const container = $(this.warpper);
    const result = nodes.map((node) => {
      let _nodeObj = null;
      if (node instanceof Node) {
        _nodeObj = node;
      } else {
        const _Node = node.Class || Node;
        _nodeObj = new _Node(_.assign(_.cloneDeep(node), {
          _on: this.on.bind(this),
          _emit: this.emit.bind(this),
          draggable: this.draggable
        }));
      }

      if (this._isExistNode(_nodeObj)) {
        // 后续用新的node代码旧的node
        console.log(`node:${_nodeObj.id} has existed`);
        return;
      }

      // 节点初始化
      _nodeObj._init();

      // 假如节点存在group，即放进对应的节点组里
      const existGroup = _nodeObj.group ? this.getGroup(_nodeObj.group) : null;
      if (existGroup) {
        existGroup.addNode(_nodeObj, existGroup.id);
      } else {
        _canvasFragment.appendChild(_nodeObj.dom);
      }

      this.nodes.push(_nodeObj);
      return _nodeObj;
    });

    // 批量插入dom，性能优化
    container.append(_canvasFragment);

    result.forEach((item) => {
      // 渲染endpoint
      item._createEndpoint(isNotEventEmit);

      // 节点挂载
      item.mounted && item.mounted();
    });
    return result;
  }

  addNode(node, isNotEventEmit) {
    return this.addNodes([node], isNotEventEmit)[0];
  }

  addEdges(links) {
    $(this.svg).css('display', 'none');

    const _edgeFragment = document.createDocumentFragment();
    const _labelFragment = document.createDocumentFragment();
    const _arrowFragment = document.createDocumentFragment();

    const result = links.map((link) => {
      const EdgeClass = this.theme.edge.Class;
      
      if (link.type === 'endpoint') {
        const sourceNode = this.getNode(link.sourceNode);
        const targetNode = this.getNode(link.targetNode);
        const sourceEndpoint = sourceNode.getEndpoint(link.source);
        const targetEndpoint = targetNode.getEndpoint(link.target);

        let sourceGroup;
        let targetGroup;
        if (sourceNode.group) {
          sourceGroup = this.getGroup(sourceNode.group);
        }
        if (targetNode.group) {
          targetGroup = this.getGroup(targetNode.group);
        }

        if (!sourceEndpoint || !targetEndpoint) {
          console.log(`butterflies error: can not connect edge. link sourceId:${link.source};link targetId:${link.target}`);
          return;
        }

        // 线条去重
        if (!this.theme.edge.isRepeat) {
          let _isRepeat = _.some(this.edges, (_edge) => {
            return _edge.sourceNode.id === sourceNode.id &&
              _edge.sourceEndpoint.id === sourceEndpoint.id &&
              _edge.targetNode.id === targetNode.id &&
              _edge.targetEndpoint.id === targetEndpoint.id;
          });
          if (_isRepeat) {
            console.log(`id为${sourceEndpoint.id}-${targetEndpoint.id}的线条连接重复，请检查`);
            return;
          }
        }

        const edge = new EdgeClass({
          type: 'endpoint',
          id: link.id,
          label: link.label,
          shapeType: link.shapeType || this.theme.edge.type,
          orientationLimit: this.theme.endpoint.position,
          sourceNode,
          targetNode,
          sourceEndpoint,
          targetEndpoint,
          sourceGroup,
          targetGroup,
          arrow: link.arrow,
          arrowPosition: link.arrowPosition,
          options: link,
          _on: this.on.bind(this),
          _emit: this.emit.bind(this),
        });
        edge._init();

        _edgeFragment.appendChild(edge.dom);

        if (edge.labelDom) {
          _labelFragment.appendChild(edge.labelDom);
        }

        if (edge.arrowDom) {
          _arrowFragment.appendChild(edge.arrowDom);
        }

        this.edges.push(edge);

        edge.mounted && edge.mounted();

        return edge;
      } 
      const sourceNode = this.getNode(link.source);
      const targetNode = this.getNode(link.target);
      let sourceGroup;
      let targetGroup;

      if (sourceNode.group) {
        sourceGroup = this.getGroup(sourceNode.group);
      }
      if (targetNode.group) {
        targetGroup = this.getGroup(targetGroup.group);
      }

      if (!sourceNode || !targetNode) {
        console.log(`butterflies error: can not connect edge. link sourceId:${link.source};link targetId:${link.target}`);
        return;
      }

      const edge = new EdgeClass({
        type: 'node',
        id: link.id,
        label: link.label,
        sourceNode,
        targetNode,
        sourceGroup,
        targetGroup,
        shapeType: link.shapeType || this.theme.edge.type,
        orientationLimit: this.theme.endpoint.position,
        arrow: link.arrow,
        arrowPosition: link.arrowPosition,
        _on: this.on.bind(this),
        _emit: this.emit.bind(this),
      });
      edge._init();
        
      _edgeFragment.appendChild(edge.dom);

      if (edge.labelDom) {
        _labelFragment.appendChild(edge.labelDom);
      }

      if (edge.arrowDom) {
        _arrowFragment.appendChild(edge.arrowDom);
      }

      this.edges.push(edge);

      return edge;
    }).filter(item => item);

    $(this.svg).append(_edgeFragment, _arrowFragment);

    $(this.warpper).append(_labelFragment);

    result.forEach((link) => {
      let _soucePoint = {};
      let _targetPoint = {};
      if (link.type === 'endpoint') {
        _soucePoint = {
          pos: [link.sourceEndpoint._posLeft + link.sourceEndpoint._width / 2, link.sourceEndpoint._posTop + link.sourceEndpoint._height / 2]
        };
        _targetPoint = {
          pos: [link.targetEndpoint._posLeft + link.targetEndpoint._width / 2, link.targetEndpoint._posTop + link.targetEndpoint._height / 2]
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

    $(this.svg).css('display', 'block');
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
      console.log(`找不到id为：${nodeId}的节点`);
      return;
    }

    // 删除邻近的线条
    const neighborEdges = this.getNeighborEdges(nodeId);
    if (!isNotDelEdge) {
      this.edges = this.edges.filter((edge) => {
        const _edge = _.find(neighborEdges, item => item.id === edge.id);
        return !_edge;
      });

      neighborEdges.forEach((item) => {
        item.destroy(isNotEventEmit);
      });
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

  removeEdge(edgeId) {
    const edgeIndex = _.findIndex(this.edges, item => item.id === edgeId);
    if (edgeIndex !== -1) {
      const edge = this.edges[edgeIndex];
      this.edges = this.edges.filter(item => item.id !== edgeId);
      edge.destroy();
      return edge;
    } 
    console.log(`删除线条错误，不存在id为${edgeId}的线`);
  }

  removeEdges(edgeIds) {
    return edgeIds.map(item => this.removeEdge(item)).filter(item => item);
  }

  removeGroup(groupId) {
    const index = _.findIndex(this.groups, _group => _group.id === groupId);
    // 删除group
    const group = this.groups.splice(index, 1)[0];

    // this.nodes.forEach((node) => {
    //   if (node.group === group.id) {
    //     node.top += group.top;
    //     node.left += group.top;
    //     delete node.group;
    //   }
    // });

    group.nodes.forEach((_node) => {
      let rmItem = this.removeNode(_node.id, true, true);
      let rmNode = rmItem.nodes[0];
      let neighborEdges = rmItem.edges;
      rmNode._init({
        top: _node.top + group.top,
        left: _node.left + group.left,
        _isDeleteGroup: true
      });
      this.addNode(rmNode, true);
      neighborEdges.forEach((item) => {
        item.redraw();
      });
    });

    // const rmItem = this.removeNode(this._dragNode.id, true, true);
    // const rmNode = rmItem.nodes[0];
    // neighborEdges = rmItem.edges;
    // rmNode._init({
    //   top: _nodeTop - targetGroup.top,
    //   left: _nodeLeft - targetGroup.left,
    //   group: targetGroup.id
    // });
    // this.addNode(rmNode, true);
    group.destroy();
  }

  getNeighborEdges(nodeId) {
    const node = _.find(this.nodes, item => nodeId === item.id);

    return this.edges.filter(item => _.get(item, 'sourceNode.id') === node.id || _.get(item, 'targetNode.id') === node.id);
  }

  getNeighborNodes(nodeId) {
    const result = [];
    const node = _.find(this.nodes, item => nodeId === item.id);
    if (!node) {
      console.log(`找不到id为${nodeId}的节点`);
    }
    this.edges.forEach((item) => {
      if (item.sourceNode.id === nodeId) {
        result.push(item.targetNode.id);
      } else if (item.targetNode.id === nodeId) {
        result.push(item.sourceNode.id);
      }
    });

    return result.map(id => this.getNode(id));
  }

  setZoomable(flat) {
    if (!this._zoomCb) {
      this._zoomCb = (event) => {
        event.preventDefault();
        const deltaY = event.deltaY;
        this._zoomData += deltaY * 0.01;
  
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
          this.warpper.style[`${platform[i]}Transform`] = scale;
        }
        this.warpper.style.transform = scale;
        this._coordinateService._changeCanvasInfo({
          scale: this._zoomData
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
  focusNodesWithAnimate(param, type = ['node'], callback) {
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
        });
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

    let canDisX = canRight - canLeft;
    let terDisX = this._rootWidth;
    let canDisY = canBottom - canTop;
    let terDisY = this._rootHeight;
    let scaleX = terDisX / canDisX;
    let scaleY = terDisY / canDisY;

    // 这里要根据scale来判断
    let scale = scaleX < scaleY ? scaleX : scaleY;
    scale = 1 < scale ? 1 : scale;

    let terLeft = this._coordinateService.canvas2terminal('x', canLeft, {
      scale: scale,
      canOffsetX: 0,
      canOffsetY: 0,
      terOffsetX: 0,
      terOffsetY: 0
    });
    let terRight = this._coordinateService.canvas2terminal('x', canRight, {
      scale: scale,
      canOffsetX: 0,
      canOffsetY: 0,
      terOffsetX: 0,
      terOffsetY: 0
    });
    let terTop = this._coordinateService.canvas2terminal('y', canTop, {
      scale: scale,
      canOffsetX: 0,
      canOffsetY: 0,
      terOffsetX: 0,
      terOffsetY: 0
    });
    let terBottom = this._coordinateService.canvas2terminal('y', canBottom, {
      scale: scale,
      canOffsetX: 0,
      canOffsetY: 0,
      terOffsetX: 0,
      terOffsetY: 0
    });

    let offsetX = (terLeft + terRight - this._rootWidth) / 2;
    let offsetY = (terTop + terBottom - this._rootHeight) / 2;

    offsetX = -offsetX;
    offsetY = -offsetY;

    const time = 500;
    $(this.warpper).animate({
      top: offsetY,
      left: offsetX,
    }, time);
    this._moveData = [offsetX, offsetY];

    this.zoom(scale, callback);
  }
  focusCenterWithAnimate(callback) {
    let nodeIds = this.nodes.map((item) => {
      return item.id;
    });
    let groupIds = this.groups.map((item) => {
      return item.id;
    });

    this.focusNodesWithAnimate({
      nodes: nodeIds,
      groups: groupIds
    }, ['node', 'group'], callback);
  }
  focusNodeWithAnimate(param, type = 'node', callback) {
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

    const containerW = this._rootWidth;
    const containerH = this._rootHeight;

    const targetY = containerH / 2 - top;
    const targetX = containerW / 2 - left;

    const time = 500;
    
    // animate不支持scale，使用setInterval自己实现
    $(this.warpper).animate({
      top: targetY,
      left: targetX,
    }, time);
    this._moveData = [targetX, targetY];
    
    this.zoom(1, callback);

    this._coordinateService._changeCanvasInfo({
      canOffsetX: targetX,
      canOffsetY: targetY,
      scale: 1
    });
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
        if (frame === 20) {
          clearInterval(timer);
          callback && callback();
        }
        this._zoomData += interval;
        this._coordinateService._changeCanvasInfo({
          scale: this._zoomData
        });
        $(this.warpper).css({
          transform: `scale(${this._zoomData})`
        });
        frame++;
      }, time / 20);
    }
  }

  move(position) {
    $(this.warpper)
      .css('left', position[0])
      .css('top', position[1]);
    this._coordinateService._changeCanvasInfo({
      canOffsetX: position[0],
      canOffsetY: position[1]
    });
    this._moveData = position;
  }

  getZoom() {
    return this._zoomData;
  }

  getMovePosition() {
    return this._moveData;
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
      this.clearUnion();
      this.selecModel = type;
      this.canvasWarpper.active();
      this._remarkMove = this.moveable;
      this._remarkZoom = this.zoomable;
      this.setZoomable(false);
      this.setMoveable(false);
    } else {
      this.isSelectMode = false;
      this.canvasWarpper.unActive();

      if (this._remarkMove) {
        this.setMoveable(true);
      }
      if (this._remarkZoom) {
        this.setZoomable(true);
      }
    }
  }

  add2Union(obj) {
    let data = obj.data;
    if (!data) {
      return;
    }
    data = [].concat(data);
    data.filter((item) => {
      return !!item;
    }).forEach((item) => {
      let isId = _.isString(item);
      switch (obj.type) {
        case 'node':
          let node = isId ? this.getNode(item) : item;
          node && (this.unionItem.nodes.push(node));
          break;
        case 'group':
          let group = isId ? this.getGroup(item) : item;
          group && (this.unionItem.groups.push(group));
          break;
        case 'edge':
          let edge = isId ? this.getEdge(item) : item;
          edge && (this.unionItem.edges.push(edge));
          break;
        case 'endpoint':
          this.unionItem.endpoints.push(item);
          break;
      }
    });
  }

  rmFromUnion(obj) {

  }

  clearUnion() {
    this.unionItem.nodes = [];
    this.unionItem.edges = [];
    this.unionItem.groups = [];
    this.unionItem.endpoints = [];
  }

  _genSvgWarpper() {
    // 生成svg的warpper
    const svg = $(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
      .attr('class', 'butterfly-svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('version', '1.1')
      // .css('position', 'absolute')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .appendTo(this.warpper);
    return this.svg = svg;
  }

  _genWarpper() {
    // 生成warpper
    const warpper = $('<div class="butterfly-warpper"></div>')
      .appendTo(this.root);
    return this.warpper = warpper[0];
  }

  _genCanvasWarpper() {
    // 生成canvas warpper
    this.canvasWarpper = new SelectCanvas();
    this.canvasWarpper.init({
      root: this.root,
      _on: this.on.bind(this),
      _emit: this.emit.bind(this)
    });
  }

  _addEventLinster() {
    if (this.zoomable) {
      this.setZoomable(true);
    }
    if (this.moveable) {
      this.setMoveable(true);
    }

    $(window).resize(() => {
      this._rootWidth = $(this.root).width();
      this._rootHeight = $(this.root).height();
    });

    $(this.warpper).on('click', (e) => {
      this.emit('system.canvas.click');
      this.emit('events', {
        type: 'canvas:click'
      });
    });

    // 绑定一大堆事件，group:addMember，groupDragStop，group:removeMember，beforeDetach，connection，
    this.on('InnerEvents', (data) => {
      if (data.type === 'node:addEndpoint') {
        this._addEndpoint(data.data, data.isInited);
      } else if (data.type === 'node:dragBegin') {
        this._dragType = 'node:drag';
        this._dragNode = data.data;
      } else if (data.type === 'group:dragBegin') {
        this._dragType = 'group:drag';
        this._dragNode = data.data;
      } else if (data.type === 'endpoint:linkBegin') {
        this._dragType = 'endpoint:drag';
        this._dragEndpoint = data.data;
      } else if (data.type === 'multiple:select') {
        const result = this._selectMytiplyItem(data.range);
        // 把框选的加到union的数组
        _.assign(this.unionItem, this.selectItem);

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

  _addEndpoint(endpoint, isInited) {
    endpoint._init({
      _coordinateService: this._coordinateService
    });

    // 非自定义dom，自定义dom不需要定位
    if (!endpoint._isInitedDom) {
      const endpointDom = endpoint.dom;
      if (endpoint._node.group) {
        const group = this.getGroup(endpoint._node.group);
        $(group.dom).append(endpointDom);
      } else {
        $(this.warpper).prepend(endpointDom);
      }
      endpoint.updatePos();
      endpoint.mounted && endpoint.mounted();
    }
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

    const rootOffsetX = this._rootOffsetX;
    const rootOffsetY = this._rootOffsetY;

    const rootWidth = this._rootWidth;
    const rootHeight = this._rootHeight;

    const mouseDownEvent = (event) => {
      const LEFT_BUTTON = 0;
      if (event.button !== LEFT_BUTTON) {
        return;
      }

      if (!this._dragType && this.moveable) {
        this._dragType = 'canvas:drag';
      }

      canvasOriginPos = {
        x: event.clientX,
        y: event.clientY
      };

      this.emit('system.drag.start', {
        dragType: this._dragType,
        position: {
          clientX: event.clientX,
          clientY: event.clientY,
          canvasX: this._coordinateService.terminal2canvas('x', event.clientX),
          canvasY: this._coordinateService.terminal2canvas('y', event.clientY)
        }
      });
      this.emit('events', {
        type: 'drag:start',
        dragType: this._dragType,
        position: {
          clientX: event.clientX,
          clientY: event.clientY,
          canvasX: this._coordinateService.terminal2canvas('x', event.clientX),
          canvasY: this._coordinateService.terminal2canvas('y', event.clientY)
        }
      });
    };

    const mouseMoveEvent = (event) => {
      const LEFT_BUTTON = 0;
      if (event.button !== LEFT_BUTTON) {
        return;
      }
      if (this._dragType) {
        const canvasX = this._coordinateService.terminal2canvas('x', event.clientX);
        const canvasY = this._coordinateService.terminal2canvas('y', event.clientY);
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
            const isUnion = _.find(this.unionItem.nodes, _node => _node.id === this._dragNode.id);
            if (isUnion) {
              moveNodes = this.unionItem.nodes;
            } else {
              this.clearUnion();
            }
            $(this.svg).css('display', 'none');
            $(this.warpper).css('display', 'none');
            moveNodes.forEach((node) => {
              node.moveTo(node.left + (canvasX - nodeOriginPos.x), node.top + (canvasY - nodeOriginPos.y));
              $(this.svg).css('display', 'none');
              this.edges.forEach((edge) => {
                if (edge.type === 'endpoint') {
                  const isLink = _.find(node.endpoints, point => point.id === edge.sourceEndpoint.id || point.id === edge.targetEndpoint.id);
                  isLink && edge.redraw();
                } else if (edge.sourceNode.id === node.id || edge.targetNode.id === node.id) {
                  edge.redraw();
                }
              });
            });
            $(this.svg).css('display', 'block');
            $(this.warpper).css('display', 'block');
            nodeOriginPos = {
              x: canvasX,
              y: canvasY
            };
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
            const group = this._dragNode;
            group.moveTo(group.left + (canvasX - nodeOriginPos.x), group.top + (canvasY - nodeOriginPos.y));
            this.edges.forEach((edge) => {
              if (edge.sourceNode.group === group.id || edge.targetNode.group === group.id) {
                edge.redraw();
              }
            });
            nodeOriginPos = {
              x: canvasX,
              y: canvasY
            };
          }
        } else if (this._dragType === 'endpoint:drag') {

          let isUnion = !!_.find(this.unionItem.endpoints || [], (item) => {
            return item.id === this._dragEndpoint.id;
          });

          // const beginX = this._dragEndpoint._posLeft + this._dragEndpoint._width / 2;
          // const beginY = this._dragEndpoint._posTop + this._dragEndpoint._height / 2;

          const endX = this._coordinateService.terminal2canvas('x', event.clientX);
          const endY = this._coordinateService.terminal2canvas('y', event.clientY);

          let edges = [];
          if (!this._dragEdges || this._dragEdges.length === 0) {
            const EdgeClass = this.theme.edge.Class;
            let endpoints = isUnion ? this.unionItem.endpoints : [this._dragEndpoint];
            endpoints.forEach((point) => {
              let _newEdge = new EdgeClass({
                shapeType: this.theme.edge.type,
                orientationLimit: this.theme.endpoint.position,
                sourceNode: this.getNode(point.nodeId),
                sourceEndpoint: point,
                arrow: this.theme.edge.arrow,
                _on: this.on.bind(this),
                _emit: this.emit.bind(this),
              });
              _newEdge._init();
              $(this.svg).append(_newEdge.dom);
              if (_newEdge.labelDom) {
                $(this.warpper).append(_newEdge.labelDom);
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

          $(this.svg).css('display', 'none');
          $(this.warpper).css('display', 'none');
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
          $(this.svg).css('display', 'block');
          $(this.warpper).css('display', 'block');

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
        } else if (this._dragType === 'group:resize') {
          let canvasX = this._coordinateService.terminal2canvas('x', event.clientX);
          let canvasY = this._coordinateService.terminal2canvas('y', event.clientY);

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

      // 处理线条的问题
      if (this._dragEdges && this._dragEdges.length !== 0) {
        // 释放对应画布上的x,y
        const x = this._coordinateService.terminal2canvas('x', event.clientX);
        const y = this._coordinateService.terminal2canvas('y', event.clientY);

        let _targetEndpoint = null;

        this.nodes.forEach((_node) => {
          if (_node.endpoints) {
            _node.endpoints.forEach((_point) => {
              const _maxX = _point._posLeft + _point._width + 10;
              const _maxY = _point._posTop + _point._height + 10;
              const _minX = _point._posLeft - 10;
              const _minY = _point._posTop - 10;
              if (x > _minX && x < _maxX && y > _minY && y < _maxY) {
                _targetEndpoint = _point;
              }
            });
          }
        });

        let isDestoryEdges = false;

        // 找不到点 或者 目标节点不是target 
        if (!_targetEndpoint || _targetEndpoint.type !== 'target') {
          isDestoryEdges = true;
        }

        // scope不同
        if (!isDestoryEdges) {
          isDestoryEdges = _.some(this._dragEdges, (edge) => {
            return edge.sourceEndpoint.scope !== this._dragEndpoint.scope;
          });
        }

        if (isDestoryEdges) {
          this._dragEdges.forEach((edge) => {
            edge.destroy();
          });
        } else {
          this._dragEdges.forEach((edge) => {
            // 线条去重
            if (!this.theme.edge.isRepeat) {
              let _isRepeat = _.some(this.edges, (_edge) => {
                return _edge.sourceNode.id === edge.sourceNode.id &&
                  _edge.sourceEndpoint.id === edge.sourceEndpoint.id &&
                  _edge.targetNode.id === _targetEndpoint.nodeId &&
                  _edge.targetEndpoint.id === _targetEndpoint.id;
              });
              if (_isRepeat) {
                console.log(`id为${edge.sourceEndpoint.id}-${_targetEndpoint.id}的线条连接重复，请检查`);
                edge.destroy();
                return;
              }
            }
            edge._create({
              id: `${edge.sourceEndpoint.id}-${_targetEndpoint.id}`,
              targetNode: this.getNode(_targetEndpoint.nodeId),
              targetEndpoint: _targetEndpoint,
              type: 'endpoint'
            });
            this.edges.push(edge);
          });
          this.emit('system.link.connect', {
            links: this._dragEdges
          });
          this.emit('events', {
            type: 'link:connect',
            links: this._dragEdges
          });
        }
      }
      if (this._dragType === 'node:drag' && this._dragNode) {
        let sourceGroup = null;

        let _nodeLeft = this._dragNode.left;
        let _nodeRight = this._dragNode.left + this._dragNode.getWidth();
        let _nodeTop = this._dragNode.top;
        let _nodeBottom = this._dragNode.top + this._dragNode.getHeight();

        if (this._dragNode.group) {
          const _group = this.getGroup(this._dragNode.group);
          const _groupLeft = _group.left;
          const _groupRight = _group.left + _group.getWidth();
          const _groupTop = _group.top;
          const _groupBottom = _group.top + _group.getHeight();
          // if (_nodeLeft > _groupRight || _nodeRight < _groupLeft || _nodeTop > _groupBottom || _nodeBottom < _groupTop) {
          //   _nodeLeft += _groupLeft;
          //   _nodeTop += _groupTop;
          //   sourceGroup = _group;
          // }
          if (_nodeRight < 0 || _nodeLeft > _group.getWidth() || _nodeBottom < 0 || _nodeTop > _group.getHeight()) {
            _nodeLeft += _groupLeft;
            _nodeTop += _groupTop;
            _nodeRight += _groupLeft;
            _nodeBottom += _groupTop;
            sourceGroup = _group;
          }
        }

        let targetGroup = null;
        for (let i = 0; i < this.groups.length; i++) {
          const _group = this.groups[i];
          const _groupLeft = _group.left;
          const _groupRight = _group.left + _group.getWidth();
          const _groupTop = _group.top;
          const _groupBottom = _group.top + _group.getHeight();
          if (_groupLeft <= _nodeLeft && _groupRight >= _nodeRight && _groupTop <= _nodeTop && _groupBottom >= _nodeBottom) {
            if (_group.id !== this._dragNode.group) {
              targetGroup = _group;
              break;
            }
          }
        }

        let neighborEdges = [];
        if (sourceGroup) {
          const rmItem = this.removeNode(this._dragNode.id, true, true);
          const rmNode = rmItem.nodes[0];
          neighborEdges = rmItem.edges;
          const nodeData = {
            id: rmNode.id,
            top: _nodeTop,
            left: _nodeLeft,
            _isDeleteGroup: true
          };

          this.emit('events', {
            type: 'system.group.rmoveMember',
            group: sourceGroup,
            node: rmNode
          });
          this.emit('system.group.rmoveMember', {
            group: sourceGroup,
            node: rmNode
          });

          if (targetGroup) {
            nodeData.top -= targetGroup.top;
            nodeData.left -= targetGroup.left;
            nodeData.group = targetGroup.id;
            nodeData._isDeleteGroup = false;
            this.emit('events', {
              type: 'system.group.addMember',
              node: rmNode,
              group: targetGroup
            });
            this.emit('system.group.addMember', {
              node: rmNode,
              group: targetGroup
            });
          }
          rmNode._init(nodeData);
          this.addNode(rmNode, true);
        } else if (targetGroup) {
          const rmItem = this.removeNode(this._dragNode.id, true, true);
          const rmNode = rmItem.nodes[0];
          neighborEdges = rmItem.edges;
          rmNode._init({
            top: _nodeTop - targetGroup.top,
            left: _nodeLeft - targetGroup.left,
            group: targetGroup.id
          });
          this.addNode(rmNode, true);
          this.emit('events', {
            type: 'system.group.addMember',
            node: rmNode,
            group: targetGroup
          });
          this.emit('system.group.addMember', {
            node: rmNode,
            group: targetGroup
          });
        }
        neighborEdges.forEach((item) => {
          item.redraw();
        });
      }

      // 节点组放大缩小
      if (this._dragType === 'group:resize' && this._dragGroup) {

      }

      this.emit('system.drag.end', {
        dragType: this._dragType
      });
      this.emit('events', {
        type: 'drag:end',
        dragType: this._dragType
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
    };


    this.root.addEventListener('mousedown', mouseDownEvent);
    this.root.addEventListener('mousemove', mouseMoveEvent);
    // this.root.addEventListener('mouseout', mouseEndEvent);
    this.root.addEventListener('mouseup', mouseEndEvent);
  }
  _autoLayout(data) {
    const width = this._rootWidth;
    const height = this._rootHeight;

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
            source: item.type === 'endpoint' ? item.sourceNodeCode : item.source,
            target: item.type === 'endpoint' ? item.targetNodeCode : item.target
          }))
        }
      });
    }
  }

  _selectMytiplyItem(range) {
    // 确认一下终端的偏移值
    const startX = this._coordinateService.terminal2canvas('x', range[0]);
    const startY = this._coordinateService.terminal2canvas('y', range[1]);
    const endX = this._coordinateService.terminal2canvas('x', range[2]);
    const endY = this._coordinateService.terminal2canvas('y', range[3]);
    
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
}

module.exports = BaseCanvas;
