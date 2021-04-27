import {Node} from 'butterfly-dag';
import $ from 'jquery';
import _ from 'lodash';

import './panel-node.less';

class PanelNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
    this.actived = false;
    this.controlEndPointNE = null;
    this.controlEndPointSE = null;
    this.controlEndPointSW = null;
    this.controlEndPointNW = null;
    this.controlEndPointR = null;

    this.content = opts.content;
    
    this.width = 36;
    this.height = 36;

    this.moveDirection = null;
  }

  draw = (opts) => {
    let container = $('<div class="panel-node"></div>')
      .attr('id', this.id)
      .css('top', this.top + 'px')
      .css('left', this.left + 'px')
      .css('width', this.width + 'px')
      .css('height', this.height +'px');

    let img = $(`<img src='${this.content}' class="panel-img"/>`);

    container.append(img);

    container.on('click', (e) => {
      this.actived = !this.actived;

      // 获取控制锚点
      if (_.isNull(this.controlEndPointNE)) {
        for (let controlEndPoint of this.endpoints) {
          switch (controlEndPoint.id) {
            case 'n-e': 
              this.controlEndPointNE = controlEndPoint;
              break;
            case 's-e': 
              this.controlEndPointSE = controlEndPoint;
              break;
            case 's-w': 
              this.controlEndPointSW = controlEndPoint;
              break;
            case 'n-w': 
              this.controlEndPointNW = controlEndPoint;
              break;
            case 'rotator': 
              this.controlEndPointR = controlEndPoint;
              break;
            default :
              break;
          }
        }
      }

      // 隐藏展示锚点
      this.isActived();
      
    })

    return container[0];
  }

  isActived = () => {
    if(this.actived){
      $(this.controlEndPointNE.dom).removeClass('unactived');
      $(this.controlEndPointSE.dom).removeClass('unactived');
      $(this.controlEndPointSW.dom).removeClass('unactived');
      $(this.controlEndPointNW.dom).removeClass('unactived');
      $(this.controlEndPointR.dom).removeClass('unactived');
    } else {
      $(this.controlEndPointNE.dom).addClass('unactived');
      $(this.controlEndPointSE.dom).addClass('unactived');
      $(this.controlEndPointSW.dom).addClass('unactived');
      $(this.controlEndPointNW.dom).addClass('unactived');
      $(this.controlEndPointR.dom).addClass('unactived');
    }
  }

  resize = (canvasX, canvasY) => {

    // console.log(this.top,canvasY);

    if (!_.isNull(this.moveDirection)) {

      switch (this.moveDirection) {
        case 'n-e' :
          this.width = canvasX - this.left;
          this.height += this.top - canvasY;
          this.top = canvasY;

          $(this.dom)
            .css('top', this.top + 'px')
            .css('width', this.width + 'px')
            .css('height', this.height +'px');

          break;
        case 's-e' :
          this.width = canvasX - this.left;
          this.height = canvasY - this.top;

          $(this.dom)
            .css('width', this.width + 'px')
            .css('height', this.height +'px');
          break;
        case 's-w' :
          this.width += this.left - canvasX;
          this.height = canvasY - this.top;
          this.left = canvasX;

          $(this.dom)
            .css('left', this.left + 'px')
            .css('width', this.width + 'px')
            .css('height', this.height +'px');
          break;
        case 'n-w' :
          this.width += this.left - canvasX;
          this.height += this.top - canvasY;
          this.left = canvasX;
          this.top = canvasY;

          $(this.dom)
          .css('top', this.top + 'px')
          .css('left', this.left + 'px')
          .css('width', this.width + 'px')
          .css('height', this.height +'px');
          break;
      };

      for (let endPoint of this.endpoints) {
        endPoint.updatePos();
      }

    }
    
    
  }

}

export default PanelNode;