'use strict';

const _ = require('lodash');
const $ = require('jquery');
const DrawUtil = require('../utils/link');
import ArrowUtil from '../utils/arrow';
import LinkAnimateUtil from '../utils/link/link_animate'

import './baseEdge.less';

import Edge from '../interface/edge';
class BaseEdge extends Edge {
  constructor(opts) {
    super(opts);
    this.id = _.get(opts, 'id');
    this.targetNode = _.get(opts, 'targetNode');
    this._targetType = _.get(opts, '_targetType');
    this.targetEndpoint = _.get(opts, 'targetEndpoint');
    this.sourceNode = _.get(opts, 'sourceNode');
    this._sourceType = _.get(opts, '_sourceType');
    this.sourceEndpoint = _.get(opts, 'sourceEndpoint');
    this.type = _.get(opts, 'type', 'endpoint');
    this.orientationLimit = _.get(opts, 'orientationLimit');
    this.shapeType = _.get(opts, 'shapeType', 'Straight');
    this.label = _.get(opts, 'label');
    this.arrow = _.get(opts, 'arrow');
    this.arrowConfig = _.get(opts, 'arrowConfig', []);
    this.arrowShapeType = _.get(opts, 'arrowShapeType', 'default');
    this.arrowPosition = _.get(opts, 'arrowPosition', 0.5);
    this.arrowOffset = _.get(opts, 'arrowOffset', 0),
    this.arrowOrientation = _.get(opts, 'arrowOrientation', 1);
    this.labelPosition = _.get(opts, 'labelPosition', 0.5);
    this.labelOffset = _.get(opts, 'labelOffset', 0),
    this.isExpandWidth = _.get(opts, 'isExpandWidth', false);
    this.defaultAnimate = _.get(opts, 'defaultAnimate', false);
    this.dom = null;
    this.labelDom = null;
    this.arrowsDom = [];
    this.arrowDom = null;
    this.eventHandlerDom = null;
    this._hasEventListener = false;
    this._coordinateService = null;
    // 鸭子辨识手动判断类型
    this.__type = 'edge';
    this._path = null;
    // 业务和库内addEdges写法上有区别，需要兼容
    this.options = _.get(opts, 'options') || opts;
    this._isDeletingEdge = opts._isDeletingEdge;
    this._global = opts._global;
    this._on = opts._on;
    this._emit = opts._emit;
    // 性能优化
    this._labelWidth = 0;
    this._labelHeight = 0;
    // 函数节流
    this._updateTimer = null;
    this._UPDATE_INTERVAL = 20;
    // 线段起始位置
    this._sourcePoint = null;
    this._targetPoint = null;
    // 线段的z-index
    this._zIndex = 0;
    // 曼哈顿线可拖动变量
    this.draggable = _.get(opts, 'draggable', false);;
    //曼哈顿线圆角显示，默认false
    this.hasRadius = _.get(opts, 'hasRadius', false);
    this._breakPoints = [];
    if (this.options.breakPoints && this.options.breakPoints.length > 0) {
      this._breakPoints = this.options.breakPoints;
      this._breakPoints[0].type === 'start';
      this._breakPoints[this._breakPoints.length - 1].type === 'end';
      delete this.options.breakPoints;
    }
    this._hasDragged = false;
  }
  _init(obj) {
    if (this._isInited) {
      return;
    }
    if (obj._coordinateService) {
      this._coordinateService = obj._coordinateService;
    }
    this._isInited = true;
    this.dom = this.draw({
      id: this.id,
      dom: this.dom,
      options: this.options
    });
    this.labelDom = this.drawLabel(this.label);
    if (this.arrow && this.arrowConfig.length !== 0) {
      this.arrowsDom = this.arrowConfig.map(() => {
        return this.drawArrow(true);
      })
    } else if (this.arrow && this.arrowConfig.length === 0) {
      this.arrowsDom = [this.drawArrow(true)];
      this.arrowDom = this.drawArrow(this.arrow);
    }
    if (!this._hasEventListener) {
      this._addEventListener();
      this._hasEventListener = true;
    }
  }
  draw(obj) {
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('class', 'butterflies-link');
    
    if (this.isExpandWidth) {
      // 扩大线选中范围
      this.eventHandlerDom = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.eventHandlerDom.setAttribute('class', 'butterflies-link-event-handler');
    }
    return path;
  }
  mounted() {
    if(this.defaultAnimate) {
      this.addAnimate();
    }
  }
  _calcPath(sourcePoint, targetPoint, isOppositeArrow = false) {
    let sourceEndpoint = this.sourceEndpoint;
    let sourceNode = this.sourceNode;
    let targetEndpoint = this.targetEndpoint;
    let targetNode = this.targetNode;
    if (isOppositeArrow) {
      sourceEndpoint = this.targetEndpoint;
      sourceNode = this.targetNode;
      targetEndpoint = this.sourceEndpoint;
      targetNode = this.targetNode;
    }
    if (!sourcePoint) {
      sourcePoint = {
        pos: [
          // this.type === 'endpoint' ? this.sourceEndpoint._posLeft + this.sourceEndpoint._width / 2 : this.sourceNode.left + this.sourceNode.dom.offsetWidth / 2,
          // this.type === 'endpoint' ? this.sourceEndpoint._posTop + this.sourceEndpoint._height / 2 : this.sourceNode.top + this.sourceNode.dom.offsetHeight / 2
          this.type === 'endpoint' ? sourceEndpoint._posLeft + sourceEndpoint._width / 2 : sourceNode.left + sourceNode.getWidth(true) / 2,
          this.type === 'endpoint' ? sourceEndpoint._posTop + sourceEndpoint._height / 2 : sourceNode.top + sourceNode.getHeight(true) / 2
        ],
        orientation: (this.type === 'endpoint' && sourceEndpoint.orientation) ? sourceEndpoint.orientation : undefined
      };
    }

    if (!targetPoint) {
      targetPoint = {
        pos: [
          // this.type === 'endpoint' ? this.targetEndpoint._posLeft + this.targetEndpoint._width / 2 : this.targetNode.left + this.targetNode.dom.offsetWidth / 2,
          // this.type === 'endpoint' ? this.targetEndpoint._posTop + this.targetEndpoint._height / 2 : this.targetNode.top + this.targetNode.dom.offsetHeight / 2
          this.type === 'endpoint' ? targetEndpoint._posLeft + targetEndpoint._width / 2 : targetNode.left + targetNode.getWidth(true) / 2,
          this.type === 'endpoint' ? targetEndpoint._posTop + targetEndpoint._height / 2 : targetNode.top + targetNode.getHeight(true) / 2
        ],
        orientation: (this.type === 'endpoint' && targetEndpoint.orientation) ? targetEndpoint.orientation : undefined
      };
    }
    this._sourcePoint = sourcePoint;
    this._targetPoint = targetPoint;
    let path = '';
    if (this.calcPath) {
      path = this.calcPath(sourcePoint, targetPoint);
    } else if (this.shapeType === 'Bezier') {
      path = DrawUtil.drawBezier(sourcePoint, targetPoint);
    } else if (this.shapeType === 'Straight') {
      path = DrawUtil.drawStraight(sourcePoint, targetPoint);
    } else if (this.shapeType === 'Flow') {
      path = DrawUtil.drawFlow(sourcePoint, targetPoint, this.orientationLimit);
    } else if (this.shapeType === 'Manhattan') {
      let obj = DrawUtil.drawManhattan(sourcePoint, targetPoint, {
        breakPoints: this._breakPoints,
        hasDragged: this._hasDragged,
        draggable: this.draggable,
        hasRadius: this.hasRadius
      });
      path = obj.path;
      obj.breakPoints[0].type = 'start';
      obj.breakPoints[obj.breakPoints.length - 1].type = 'end';
      this._breakPoints = obj.breakPoints;
    } else if (this.shapeType === 'AdvancedBezier') {
      path = DrawUtil.drawAdvancedBezier(sourcePoint, targetPoint);
    } else if (/^Bezier2-[1-3]$/.test(this.shapeType)) {
      path = DrawUtil.drawSecondBezier(sourcePoint, targetPoint, this.shapeType);
    } else if(this.shapeType === 'BrokenLine'){
      path = DrawUtil.drawBrokenLine(sourcePoint, targetPoint);
    }
    this._path = path;
    return path;
  }
  redrawLabel() {
    const length = this.dom.getTotalLength();
    if(!length) {
      return;
    }
    let labelLenth = length * this.labelPosition + this.labelOffset;
    let point = this.dom.getPointAtLength(labelLenth);
    $(this.labelDom)
      .css('left', point.x - this.labelDom.offsetWidth / 2)
      .css('top', point.y - this.labelDom.offsetHeight / 2);
  }
  drawLabel(label) {
    let isDom = typeof HTMLElement === 'object' ? (obj) => {
      return obj instanceof HTMLElement;
    } : (obj) => {
      return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    };
    if (label) {
      if (isDom(label)) {
        $(label).addClass('butterflies-label');
        return label;
      } else {
        let dom = document.createElement('span');
        dom.className = 'butterflies-label';
        dom.innerText = label;
        return dom;
      }
    }
  }
  updateLabel(label) {
    let labelDom = this.drawLabel(label);
    if (this.labelDom) {
      $(this.labelDom).off();
      $(this.labelDom).remove();
    }
    this.label = label;
    this.labelDom = labelDom;
    this.emit('InnerEvents', {
      type: 'edge:updateLabel',
      data: this
    });
  }
  redrawArrow(path, arrowCon){
    if (!arrowCon || Object.keys(arrowCon).length === 0) {
      arrowCon = this;
    }
    const length = arrowCon.dom.getTotalLength();
    if(!length) {
      return;
    }
    arrowCon.arrowFinalPosition = (length * arrowCon.arrowPosition + arrowCon.arrowOffset) / length;
    if (arrowCon.arrowFinalPosition > 1) {
      arrowCon.arrowFinalPosition = 1;
    }
    if (arrowCon.arrowFinalPosition < 0) {
      arrowCon.arrowFinalPosition = 0;
    }
    // 防止箭头窜出线条
    if (1 - arrowCon.arrowFinalPosition < ArrowUtil.ARROW_TYPE.length / length) {
      arrowCon.arrowFinalPosition = (length * arrowCon.arrowFinalPosition - ArrowUtil.ARROW_TYPE.length) / length;
    }
    // 贝塞尔曲线是反着画的，需要调整
    if (this.shapeType === 'Bezier') {
      arrowCon.arrowFinalPosition = 1 - arrowCon.arrowFinalPosition;
    }

    let point = arrowCon.dom.getPointAtLength(length * arrowCon.arrowFinalPosition);
    let x = point.x;
    let y = point.y;
    let _x = x;
    let _y = y;

    let vector = ArrowUtil.calcSlope({
      shapeType: this.shapeType,
      dom: arrowCon.dom,
      arrowPosition: arrowCon.arrowFinalPosition,
      path: path
    });
    let deg = Math.atan2(vector.y, vector.x) / Math.PI * 180;
    let arrowObj = ArrowUtil.ARROW_TYPE[arrowCon.arrowShapeType];
    let arrowWidth = arrowObj.width || 8;
    let arrowHeight = arrowObj.height || 8;
    if (arrowObj.type === 'pathString') {
      arrowCon.arrowDom.setAttribute('d', arrowObj.content);
    } else if (arrowObj.type === 'svg') {
      if (vector.x === 0) {
        _y -= arrowHeight / 2;
      } else {
        _x -= arrowWidth / 2;
        _y -= arrowHeight / 2;
      }
    }
    arrowCon.arrowDom.setAttribute('transform', `rotate(${deg}, ${x}, ${y})translate(${_x}, ${_y})`);
  }

  redrawArrows(path) {
    let arrowCon = {
      arrowPosition: 0.5,
      arrowOffset: 0,
      arrowShapeType: 'default',
      arrowOrientation: 1,
      arrowDom: this.arrowsDom[0],
      dom: this.dom
    }; 
    if (this.arrowConfig.length === 0) {
      arrowCon.arrowPosition = this.arrowPosition || 0.5;
      arrowCon.arrowOffset = this.arrowOffset || 0;
      arrowCon.arrowShapeType = this.arrowShapeType || 'default';
      arrowCon.arrowOrientation = 1;
      arrowCon.arrowDom = this.arrowsDom[0];
      arrowCon.dom = this.dom;
      this.redrawArrow(path, arrowCon);
    }
    this.arrowConfig.forEach((item, index) => {
      if (!item.arrowOrientation || item.arrowOrientation !== -1) {
        arrowCon.arrowPosition = item.arrowPosition || 0.5;
        arrowCon.arrowOffset = item.arrowOffset || 0;
        arrowCon.arrowShapeType = item.arrowShapeType || 'default';
        arrowCon.arrowOrientation = 1;
        arrowCon.arrowDom = this.arrowsDom[index];
        arrowCon.dom = this.dom;
        this.redrawArrow(path, arrowCon);
      } else if (item.arrowOrientation === -1) {
        let oppositePath = this._calcPath(null,null,true);
        let oppositeDom = this.dom.cloneNode(true);
        oppositeDom.setAttribute('d', oppositePath);
        arrowCon.arrowPosition = 1 - item.arrowPosition || 0.5;
        arrowCon.arrowOffset = 1 - item.arrowOffset || 0;
        arrowCon.arrowShapeType = item.arrowShapeType || 'default';
        arrowCon.arrowDom = this.arrowsDom[index];
        arrowCon.dom = oppositeDom;
        this.redrawArrow(path, arrowCon);
      }
    });
  }
  drawArrow(arrow) {
    if (arrow) {
      let arrowObj = ArrowUtil.ARROW_TYPE[this.arrowShapeType];
      let arrowWidth = arrowObj.width || 8;
      let arrowHeight = arrowObj.height || 8;
      let dom = undefined;
      if (arrowObj.type === 'pathString') {
        dom = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      } else if (arrowObj.type === 'svg') {
        dom = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        dom.setAttribute('href', arrowObj.content);
        dom.setAttribute('width', `${arrowWidth}px`);
        dom.setAttribute('height', `${arrowHeight}px`);
      }
      dom.setAttribute('class', 'butterflies-arrow');
      return dom;
    }
  }
  redraw(sourcePoint, targetPoint, options) {
    
    // 检查线段是否有变化
    let _oldPath = this._path;
    let _newPath = this._calcPath(sourcePoint, targetPoint);
    if (_oldPath === _newPath) {
      return ;
    }
    this.dom.setAttribute('d', _newPath);
    if (this.isExpandWidth) {
      this.eventHandlerDom.setAttribute('d', _newPath);
      $(this.eventHandlerDom).insertAfter(this.dom);
    }
    // 函数节流
    if (!this._updateTimer) {
      this._updateTimer = setTimeout(() => {
        // 重新计算label
        if (this.labelDom) {
          this.redrawLabel();
        }
        // 重新计算arrow
        if (this.arrowDom) {
          this.redrawArrow(_newPath);
        }
        if (this.arrowsDom.length !== 0) {
          this.redrawArrows(_newPath);
        }
        // 重新计算动画path
        if (this.animateDom) {
          this.redrawAnimate(_newPath);
        }
        this._updateTimer = null;
      }, this._UPDATE_INTERVAL);
    }

    this.updated && this.updated();
  }
  isConnect() {
    return true;
  }
  addAnimate(options) {
    this.animateDom = LinkAnimateUtil.addAnimate(this.dom, this._path, _.assign({},{
      num: 1, // 现在只支持1个点点
      radius: 3,
      color: '#776ef3'
    }, options), this.animateDom);
  }
  redrawAnimate(path) {
    LinkAnimateUtil.addAnimate(this.dom, this._path, {
      _isContinue: true
    }, this.animateDom);
  }
  emit(type, data) {
    super.emit(type, data);
    this._emit(type, data);
  }
  on(type, callback) {
    super.on(type, callback);
    this._on(type, callback);
  }
  remove() {
    this.emit('InnerEvents', {
      type: 'edge:delete',
      data: this
    });
  }
  setZIndex(index) {
    this.emit('InnerEvents', {
      type: 'edge:setZIndex',
      edge: this,
      index: index
    })
  }
  destroy(isNotEventEmit) {
    if (this.labelDom) {
      $(this.labelDom).off();
      $(this.labelDom).remove();
    }
    if (this.arrowDom) {
      $(this.arrowDom).remove();
    }
    if (this.arrowsDom.length !== 0) {
      for (let i=0; i<this.arrowsDom.length; i++) {
        $(this.arrowsDom[i]).remove();
      }
    }
    if (this.eventHandlerDom) {
      $(this.eventHandlerDom).off();
      $(this.eventHandlerDom).remove();
    }
    if (this.animateDom) {
      $(this.animateDom).remove();
    }
    $(this.dom).remove();
    if (this.id && !isNotEventEmit) {
      this.removeAllListeners();
    }
  }
  // 曼哈顿线的拐点
  getBreakPoints() {
    return this._breakPoints;
  }
  _addEventListener() {
    let _clickEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.emit('system.link.click', {
        edge: this
      });
      this.emit('events', {
        type: 'link:click',
        edge: this
      });
      this.emit('InnerEvents', {
        type: 'link:click',
        data: this
      });
    };

    let _mouseDownEvent = (e) => {
      let clickX = e.clientX;
      let clickY = e.clientY;
      let x = this._coordinateService._terminal2canvas('x', clickX);
      let y = this._coordinateService._terminal2canvas('y', clickY);
      
      //把 _coordinateService 传进来
      let targetPath = DrawUtil.findManhattanPoint(this._breakPoints, {x, y});
      this.emit('InnerEvents', {
        type: 'link:dragBegin',
        edge: this,
        path: targetPath
      });
    }
    
    if (this.isExpandWidth) {
      $(this.eventHandlerDom).on('click', _clickEvent);
      if (this.shapeType === 'Manhattan' && this.draggable) {
        $(this.eventHandlerDom).on('mousedown', _mouseDownEvent);
      }
    } else {
      $(this.dom).on('click', _clickEvent);
      if (this.shapeType === 'Manhattan' && this.draggable) {
        $(this.dom).on('mousedown', _mouseDownEvent);
      }
    }
  }
  _create(opts) {
    this.id = _.get(opts, 'id') || this.id;
    this.targetNode = _.get(opts, 'targetNode') || this.targetNode;
    this._targetType = _.get(opts, '_targetType') || this._targetType;
    this.targetEndpoint = _.get(opts, 'targetEndpoint') || this.targetEndpoint;
    this.sourceNode = _.get(opts, 'sourceNode') || this.sourceNode;
    this._sourceType = _.get(opts, '_sourceType') || this._sourceType;
    this.sourceEndpoint = _.get(opts, 'sourceEndpoint') || this.sourceEndpoint;
    this.type = _.get(opts, 'type') || this.type;
    _.set(this, 'options.targetNode', _.get(this, 'targetNode.id'));
    _.set(this, 'options.targetEndpoint', _.get(this, 'targetEndpoint.id'));
    this.redraw();
  }
  _updatePath(path, pos) {

    // 增加拐点
    if (this._breakPoints[path.index].type === 'start') {
      let newBreakPoint = _.cloneDeep(this._breakPoints[path.index]);
      this._breakPoints.unshift(newBreakPoint);
      path.index++;
      delete this._breakPoints[path.index].type;
    } else if (this._breakPoints[path.index + 1].type === 'end') {
      let newBreakPoint = _.cloneDeep(this._breakPoints[path.index + 1]);
      this._breakPoints.push(newBreakPoint);
      delete this._breakPoints[path.index + 1].type;
    }

    if (path.direction === 'vertical') {
      this._breakPoints[path.index].x = pos.x;
      this._breakPoints[path.index + 1].x = pos.x;
    } else {
      this._breakPoints[path.index].y = pos.y;
      this._breakPoints[path.index + 1].y = pos.y;
    }
    this._hasDragged = true;
    this.redraw();

    // 减少拐点
    for(let i = 0; i < this._breakPoints.length - 1; i++) {
      let point1 = this._breakPoints[i];
      let point2 = this._breakPoints[i + 1];
      if (point1.x === point2.x && point1.y === point2.y && point1.type !== 'start' && point2.type !== 'end') {
        this._breakPoints.splice(i, 2);
        path.index = path.index - 2 > 0 ? path.index - 2: 0;
      }
    }
  }
}

export default BaseEdge;
