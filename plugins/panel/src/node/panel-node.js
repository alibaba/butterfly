import {Node} from 'butterfly-dag';
import $ from 'jquery';
import _ from 'lodash';

import panelPlugins from '../index.js';

import './panel-node.less';

class PanelNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
    // 是否选中状态 
    this.actived = false;

    // 连线锚点
    this.endPointN = null;
    this.endPointE = null;
    this.endPointS = null;
    this.endPointW = null;

    // 控制点
    this.controlEndPointR = null;
    this.controlEndPointNE = null;
    this.controlEndPointSE = null;
    this.controlEndPointSW = null;
    this.controlEndPointNW = null;

    this.content = opts.content || null;
    
    this.width = opts.width || 36;
    this.height = opts.height || 36;

    // 旋转角度
    this.rotatorDeg = opts.rotate || 0;
    // 旋转前的4个控制点的位置
    this.rotatorPosBefore = {
      NW: {X: this.left, Y: this.top},
      NE: {X: this.left + this.width, Y: this.top},
      SE: {X: this.left + this.width, Y: this.top + this.height},
      SW: {X: this.left, Y: this.top + this.height},
    }
    // 旋转后的4个控制点的位置
    this.rotatorPosAfter = {
      NW: {X: this.left, Y: this.top},
      NE: {X: this.left + this.width, Y: this.top},
      SE: {X: this.left + this.width, Y: this.top + this.height},
      SW: {X: this.left, Y: this.top + this.height},
    }
    // 标识是那个控制点在移动
    this.moveDirection = null;
  }

  mounted = () => {
    this.addEndpoint({
      id: 'n',
      dom: this.endPointN,
    });
    this.addEndpoint({
      id: 'e',
      dom: this.endPointE,
    });
    this.addEndpoint({
      id: 's',
      dom: this.endPointS,
    });
    this.addEndpoint({
      id: 'w',
      dom: this.endPointW,
    });

    this._update();
  }

  draw = (opts) => {
    let container = $('<div class="panel-node"></div>')
      .attr('id', this.id)
      .css('top', this.top + 'px')
      .css('left', this.left + 'px')
      .css('width', this.width + 'px')
      .css('height', this.height +'px');

    let content = $('<div class="panel-content"></div>');

    let img = null;

    // 根据content内容渲染，先匹配内置的ID，在匹配注册的ID，都没有对应的就直接为src插入
    if (!_.isNull(this.content)) {
      if (this.content.substring(0,6) === 'System') {
        for (let item of panelPlugins.systemData) {
          if (this.content === item.id) {
            img = $(`<img src='${item.content}' class="panel-img"/>`);
            break;
          }
        }
        if (_.isNull(img)) {
          console.warn('请输入正确的内置图片ID');
        }
      } else {
        for (let item of panelPlugins.userImgData) {
          if (this.content === item.id) {
            img = $(`<img src='${item.content}' class="panel-img"/>`);
            break;
          }
        }
      }
    }

    if (_.isNull(img)) {
      img = $(`<img src='${this.content}' class="panel-img"/>`);
    }

    this.endPointN = $('<div class="point n"></div>')
      .attr('id', 'n');
    this.endPointE = $('<div class="point e"></div>')
      .attr('id', 'e');
    this.endPointS = $('<div class="point s"></div>')
      .attr('id', 's');
    this.endPointW = $('<div class="point w"></div>')
      .attr('id', 'w');

    this.controlEndPointR = $('<div class="point rotator unactived"></div>')
      .attr('id', 'rotator');

    this.controlEndPointNE = $('<div class="point point-rect n-e unactived"></div>')
      .attr('id', 'n-e');
    this.controlEndPointSE = $('<div class="point point-rect s-e unactived"></div>')
      .attr('id', 's-e');
    this.controlEndPointSW = $('<div class="point point-rect s-w unactived"></div>')
      .attr('id', 's-w');
    this.controlEndPointNW = $('<div class="point point-rect n-w unactived"></div>')
      .attr('id', 'n-w');
    
    content.append(img);
    container.append(content);

    container.append(this.endPointN);
    container.append(this.endPointE);
    container.append(this.endPointS);
    container.append(this.endPointW);

    this.controlEndPointR.on('mousedown', (e) => {
      this.moveDirection = 'rotator';
      this._resizeEmit(e);
    });

    this.controlEndPointNE.on('mousedown', (e) => {
      this.moveDirection = 'n-e';
      this._resizeEmit(e);
    });

    this.controlEndPointSE.on('mousedown', (e) => {
      this.moveDirection = 's-e';
      this._resizeEmit(e);
    });

    this.controlEndPointSW.on('mousedown', (e) => {
      this.moveDirection = 's-w';
      this._resizeEmit(e);
    });

    this.controlEndPointNW.on('mousedown', (e) => {
      this.moveDirection = 'n-w';
      this._resizeEmit(e);
    });

    container.append(this.controlEndPointR);
    container.append(this.controlEndPointNE);
    container.append(this.controlEndPointSE);
    container.append(this.controlEndPointSW);
    container.append(this.controlEndPointNW);

    content.on('click', (e) => {
      this.actived = !this.actived;

      // 隐藏展示锚点
      this._isActived();
      
    })

    return container[0];
  }

  _isActived = () => {
    if(this.actived){
      $(this.controlEndPointNE).removeClass('unactived');
      $(this.controlEndPointSE).removeClass('unactived');
      $(this.controlEndPointSW).removeClass('unactived');
      $(this.controlEndPointNW).removeClass('unactived');
      $(this.controlEndPointR).removeClass('unactived');
    } else {
      $(this.controlEndPointNE).addClass('unactived');
      $(this.controlEndPointSE).addClass('unactived');
      $(this.controlEndPointSW).addClass('unactived');
      $(this.controlEndPointNW).addClass('unactived');
      $(this.controlEndPointR).addClass('unactived');
    }
  }

  // 计算旋转后的控制点的位置
  _calculatePos = ({X,Y},centerX,centerY) => {
    let angle = Math.atan2((Y-centerY), (X-centerX)) + this.rotatorDeg * (Math.PI / 180);
    let R = Math.sqrt((X-centerX)*(X-centerX) + (Y-centerY)*(Y-centerY));
    return {
      X: Math.cos(angle) * R + centerX,
      Y: Math.sin(angle) * R + centerY,
    }
  }

  _resizeEmit = (e) => {
    const LEFT_KEY = 0;
      if (e.button !== LEFT_KEY) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.emit('InnerEvents', {
        type: 'node:resize',
        node: this,
      });
  }

  resize = (canvasX, canvasY) => {

    let centerX = this.left + this.width/2;
    let centerY = this.top + this.height/2;

    this.rotatorPosBefore = {
      NW: {X: this.left, Y: this.top},
      NE: {X: this.left + this.width, Y: this.top},
      SE: {X: this.left + this.width, Y: this.top + this.height},
      SW: {X: this.left, Y: this.top + this.height},
    }

    this.rotatorPosAfter = {
      NW: this._calculatePos(this.rotatorPosBefore.NW, centerX, centerY),
      NE: this._calculatePos(this.rotatorPosBefore.NE, centerX, centerY),
      SE: this._calculatePos(this.rotatorPosBefore.SE, centerX, centerY),
      SW: this._calculatePos(this.rotatorPosBefore.SW, centerX, centerY),
    }

    if (!_.isNull(this.moveDirection)) {

      switch (this.moveDirection) {
        case 'n-e' :
          centerX = (canvasX + this.rotatorPosAfter.SW.X)/2;
          centerY = (canvasY + this.rotatorPosAfter.SW.Y)/2;

          this.width = (centerX - this.rotatorPosBefore.SW.X)*2;
          this.height = (this.rotatorPosBefore.SW.Y - centerY)*2;
          break;

        case 's-e' :
          centerX = (canvasX + this.rotatorPosAfter.NW.X)/2;
          centerY = (canvasY + this.rotatorPosAfter.NW.Y)/2;

          this.width = (centerX - this.rotatorPosBefore.NW.X)*2;
          this.height = (centerY - this.rotatorPosBefore.NW.Y)*2;
          break;

        case 's-w' :
          centerX = (canvasX + this.rotatorPosAfter.NE.X)/2;
          centerY = (canvasY + this.rotatorPosAfter.NE.Y)/2;

          this.width = (this.rotatorPosBefore.NE.X - centerX)*2;
          this.height = (centerY - this.rotatorPosBefore.NE.Y)*2;
          break;

        case 'n-w' :
          centerX = (canvasX + this.rotatorPosAfter.SE.X)/2;
          centerY = (canvasY + this.rotatorPosAfter.SE.Y)/2;
        
          this.width = (this.rotatorPosBefore.SE.X - centerX)*2;
          this.height = (this.rotatorPosBefore.SE.Y - centerY)*2;
          break;

        case 'rotator' :
          this.rotatorDeg = (Math.atan2((canvasY - centerY), (canvasX - centerX))) * (180 / Math.PI) + 90;   
          break;

        default :
          break;
      };
      
      this.top = centerY - this.height/2;
      this.left = centerX - this.width/2;

      $(this.dom)
      .css('top', this.top + 'px')
      .css('left', this.left + 'px')
      .css('width', this.width + 'px')
      .css('height', this.height +'px')
      .css('transform', `rotate(${this.rotatorDeg}deg)`);

      for (let endPoint of this.endpoints) {
        endPoint.updatePos();
      }

    }
    
  }

  _update = () => {
    this._isActived();
    $(this.dom)
      .css('transform', `rotate(${this.rotatorDeg}deg)`);
    for (let endPoint of this.endpoints) {
      endPoint.updatePos();
    }
  }

  focus = () => {
    this.actived = true;
    this._update();
  }

  unfocus = () => {
    this.actived = false;
    this._update();
  }

  rotate = (angle) => {
    this.rotatorDeg = angle;
    this._update();
  }

}

export default PanelNode;