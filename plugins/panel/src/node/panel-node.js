import {Node} from 'butterfly-dag';
import $ from 'jquery';
import _ from 'lodash';

import controlEndPoint from '../endpoint/panel-endpoint.js';
import './panel-node.less';

class PanelNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
    this.actived = false;

    this.endPointN = null;
    this.endPointE = null;
    this.endPointS = null;
    this.endPointW = null;
    this.controlEndPointR = null;
    this.controlEndPointNE = null;
    this.controlEndPointSE = null;
    this.controlEndPointSW = null;
    this.controlEndPointNW = null;

    this.content = opts.content;
    
    this.width = 36;
    this.height = 36;

    this.rotatorDeg = 0;
    this.rotatorPosBefore = {
      NW: {X: this.left, Y: this.top},
      NE: {X: this.left + this.width, Y: this.top},
      SE: {X: this.left + this.width, Y: this.top + this.height},
      SW: {X: this.left, Y: this.top + this.height},
    }
    this.rotatorPosAfter = {
      NW: {X: this.left, Y: this.top},
      NE: {X: this.left + this.width, Y: this.top},
      SE: {X: this.left + this.width, Y: this.top + this.height},
      SW: {X: this.left, Y: this.top + this.height},
    }
    this.moveDirection = null;
  }

  mounted() {
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

    this.addEndpoint({
      id: 'rotator',
      dom: this.controlEndPointR,
      Class: controlEndPoint,
    });

    this.addEndpoint({
      id: 'n-e',
      dom: this.controlEndPointNE,
      Class: controlEndPoint,
    });
    this.addEndpoint({
      id: 's-e',
      dom: this.controlEndPointSE,
      Class: controlEndPoint,
    });
    this.addEndpoint({
      id: 's-w',
      dom: this.controlEndPointSW,
      Class: controlEndPoint,
    });
    this.addEndpoint({
      id: 'n-w',
      dom: this.controlEndPointNW,
      Class: controlEndPoint,
    });

  }

  draw = (opts) => {
    let container = $('<div class="panel-node"></div>')
      .attr('id', this.id)
      .css('top', this.top + 'px')
      .css('left', this.left + 'px')
      .css('width', this.width + 'px')
      .css('height', this.height +'px');

    let content = $('<div class="panel-content"></div>')

    let img = $(`<img src='${this.content}' class="panel-img"/>`);

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

    this.controlEndPointNE = $('<div class="point n-e unactived"></div>')
      .attr('id', 'n-e');
    this.controlEndPointSE = $('<div class="point s-e unactived"></div>')
      .attr('id', 's-e');
    this.controlEndPointSW = $('<div class="point s-w unactived"></div>')
      .attr('id', 's-w');
    this.controlEndPointNW = $('<div class="point n-w unactived"></div>')
      .attr('id', 'n-w');
    
    content.append(img);
    container.append(content);

    container.append(this.endPointN);
    container.append(this.endPointE);
    container.append(this.endPointS);
    container.append(this.endPointW);
    container.append(this.controlEndPointR);
    container.append(this.controlEndPointNE);
    container.append(this.controlEndPointSE);
    container.append(this.controlEndPointSW);
    container.append(this.controlEndPointNW);

    content.on('click', (e) => {
      this.actived = !this.actived;

      // 隐藏展示锚点
      this.isActived();
      
    })

    return container[0];
  }

  isActived = () => {
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

  calculatePos = ({X,Y},centerX,centerY) => {
    let angle = Math.atan2((Y-centerY), (X-centerX)) + this.rotatorDeg * (Math.PI / 180);
    let R = Math.sqrt((X-centerX)*(X-centerX) + (Y-centerY)*(Y-centerY));
    return {
      X: Math.cos(angle) * R + centerX,
      Y: Math.sin(angle) * R + centerY,
    }
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
      NW: this.calculatePos(this.rotatorPosBefore.NW, centerX, centerY),
      NE: this.calculatePos(this.rotatorPosBefore.NE, centerX, centerY),
      SE: this.calculatePos(this.rotatorPosBefore.SE, centerX, centerY),
      SW: this.calculatePos(this.rotatorPosBefore.SW, centerX, centerY),
    }

    let moveCenterX,moveCenterY;

    if (!_.isNull(this.moveDirection)) {

      switch (this.moveDirection) {
        case 'n-e' :
          moveCenterX = (canvasX + this.rotatorPosAfter.SW.X)/2;
          moveCenterY = (canvasY + this.rotatorPosAfter.SW.Y)/2;

          this.width = (moveCenterX - this.rotatorPosBefore.SW.X)*2;
          this.height = (this.rotatorPosBefore.SW.Y - moveCenterY)*2;
          this.top = moveCenterY - this.height/2;

          $(this.dom)
            .css('top', this.top + 'px')
            .css('width', this.width + 'px')
            .css('height', this.height +'px');

          break;
        case 's-e' :
          moveCenterX = (canvasX + this.rotatorPosAfter.NW.X)/2;
          moveCenterY = (canvasY + this.rotatorPosAfter.NW.Y)/2;
          this.width = (moveCenterX - this.rotatorPosBefore.NW.X)*2;
          this.height = (moveCenterY - this.rotatorPosBefore.NW.Y)*2;

          $(this.dom)
            .css('width', this.width + 'px')
            .css('height', this.height +'px');
          break;
        case 's-w' :
          moveCenterX = (canvasX + this.rotatorPosAfter.NE.X)/2;
          moveCenterY = (canvasY + this.rotatorPosAfter.NE.Y)/2;

          this.width = (this.rotatorPosBefore.NE.X - moveCenterX)*2;
          this.height = (moveCenterY - this.rotatorPosBefore.NE.Y)*2;
          this.left = moveCenterX - this.width/2;

          $(this.dom)
            .css('left', this.left + 'px')
            .css('width', this.width + 'px')
            .css('height', this.height +'px');
          break;
        case 'n-w' :
          moveCenterX = (canvasX + this.rotatorPosAfter.SE.X)/2;
          moveCenterY = (canvasY + this.rotatorPosAfter.SE.Y)/2;
        
          this.width = (this.rotatorPosBefore.SE.X - moveCenterX)*2;
          this.height = (this.rotatorPosBefore.SE.Y - moveCenterY)*2;
          this.left = moveCenterX - this.width/2;
          this.top = moveCenterY - this.height/2;

          $(this.dom)
          .css('top', this.top + 'px')
          .css('left', this.left + 'px')
          .css('width', this.width + 'px')
          .css('height', this.height +'px');
          break;
        case 'rotator' :
          
          this.rotatorDeg = (Math.atan2((canvasY - centerY), (canvasX - centerX))) * (180 / Math.PI) + 90;
          $(this.dom)
            .css('transform', `rotate(${this.rotatorDeg}deg)`);

          break;
        default :
          break;
      };

      for (let endPoint of this.endpoints) {
        endPoint.updatePos();
      }

      // console.log(this.rotatorPos);

    }
    
  }

}

export default PanelNode;