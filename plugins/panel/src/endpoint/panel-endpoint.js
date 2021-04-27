// import { Endpoint } from 'butterfly-dag';
import Endpoint from '../../../../src/endpoint/baseEndpoint.js';
import $ from 'jquery';

import './panel-endpoint.less'

class controlEndPoint extends Endpoint {
  constructor(opts) {
    super(opts);
    this.isRotator = opts.rotator || false;
  }
  draw(obj) {
    console.log(obj);
    let _dom = obj.dom;
    if (!_dom) {
      _dom = $('<div class="butterflie-circle-endpoint unactived"></div>').attr('id', this.id);
    } else {
      _dom = $(_dom).attr('id', this.id);
    }
    console.log(_dom[0]);
    return _dom[0];
  }

  // updatePos(dom = this.dom, orientation = this.orientation, pos = this.pos) {
  //   if(this.isRotator){
  //     // console.log('Rotator');
  //   } else {
  //     if (this._isInitedDom) {
  //       // 计算width,height,left,top
  //       this._width = $(this.dom).outerWidth();
  //       this._height = $(this.dom).outerHeight();
  
  //       // 计算锚点起始值
  //       this._left = this._coordinateService._terminal2canvas('x', $(this.dom).offset().left + this._coordinateService.scrollLeft);
  //       this._top = this._coordinateService._terminal2canvas('y', $(this.dom).offset().top + this._coordinateService.scrollTop);
  
  //       this._posLeft = this._left;
  //       this._posTop = this._top;
  //     } else {
  //       let _currentNode = this._node;
  //       let _currentDom = $(this._node.dom);
  //       let _currentNodeType = this.nodeType;
  
  //       // 分情况弄好方向和位置
  //       const nodeW = _currentDom.outerWidth();
  //       const nodeH = _currentDom.outerHeight();
  
  //       let targetDom = null;
  //       let targetDomW = 0;
  //       let targetDomH = 0;
  //       if (this.root) {
  //         targetDom = _currentDom.find(this.root);
  //         targetDomW = targetDom.width();
  //         targetDomH = targetDom.height();
  //       }
  
  //       this._width = $(dom).outerWidth();
  //       this._height = $(dom).outerHeight();
  
  //       // 计算节点本身的偏移量
  //       const eOffsetX = this._width / 2;
  //       const eOffsetY = this._height / 2;
  
  //       let _offsetTop = 0;
  //       let _offsetLeft = 0;
  
  //       const _orientation = orientation || this.orientation || [0, -1];
  //       const _pos = pos || this.pos || [_orientation[0] === 0 ? 0.5 : 0, _orientation[1] === 0 ? 0.5 : 0];
  
  //       const result = [0, 0];
  
  //       const _ox = _orientation[0];
  //       const _oy = _orientation[1];
  //       const _px = _pos[0];
  //       const _py = _pos[1];
  //       if (_ox === 0) {
  //         result[0] = !this.root ? nodeW * _px - eOffsetX : targetDomW * _px - eOffsetX;
  //       } else if (_ox === -1) {
  //         result[0] = 0 - eOffsetX;
  //       } else if (_ox === 1) {
  //         result[0] = !this.root ? nodeW - eOffsetX : targetDomW - eOffsetX;
  //       }
  
  //       if (_oy === 0) {
  //         result[1] = !this.root ? nodeH * _py - eOffsetY : targetDomH * _py - eOffsetY;
  //       } else if (_oy === -1) {
  //         result[1] = 0 - eOffsetY;
  //       } else if (_oy === 1) {
  //         result[1] = !this.root ? nodeH - eOffsetY : targetDomH - eOffsetY;
  //       }
  //       // 计算绝对定位
  //       if (_currentNode && !this.root) {
  //         _offsetTop += _currentNode.top;
  //         _offsetLeft += _currentNode.left;
  //       } else if (_currentNode && this.root) {
  //         // 计算传入的dom距离跟节点
  //         const nodeDomOffsets = _currentDom.offset();
  //         const targetDomOffsets = targetDom.offset();
  //         // 先计算目标节点和父节点得差值再加上父节点的offset
  //         _offsetTop += (targetDomOffsets.top - nodeDomOffsets.top + _currentNode.top);
  //         _offsetLeft += (targetDomOffsets.left - nodeDomOffsets.left + _currentNode.left);
  //       }
  //       this._top = result[1] + _offsetTop;
  //       this._left = result[0] + _offsetLeft;
  //       this._posTop = this._top;
  //       this._posLeft = this._left;
  //       if (_currentNode._group) {
  //         let _groupPos = this._getGroupPos(_currentNode._group);
  //         this._posTop += _groupPos.top;
  //         this._posLeft += _groupPos.left;
  //       }
  //       $(dom)
  //         .css('top', this._top)
  //         .css('left', this._left);
  
  //       this.updated && this.updated();
  //     }
  //   }

  //   this.emit('InnerEvents', {
  //     type: 'endpoint:updatePos',
  //     point: this
  //   });
  // }

  attachEvent() {
    $(this.dom).on('mousedown', (e) => {
      const LEFT_KEY = 0;
      if (e.button !== LEFT_KEY) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.options._node.moveDirection = this.id;
      this.emit('InnerEvents', {
        type: 'node:resize',
        node: this.options._node,
      });
    });
  }

};
export default controlEndPoint;