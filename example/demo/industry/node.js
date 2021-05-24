import {Node} from 'butterfly-dag';
import $ from 'jquery';
import './node.less';
class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.options = opts;
    this._endpoint = [];
    this._isInNode = false;
    this._isInEndpoint = false;
  }
  draw = (opts) => {
    let container = $('<div class="industry-base-node"></div>')
      .css('top', opts.top)
      .css('left', opts.left)
      .attr('id', opts.id);

    let icon = $(`<div class="circle ${opts.options.circleColor}"><i class="iconfont ${opts.options.iconType}"></i></div>`)[0];

    let logoContainer = $('<div class="logo-container"></div>');
    logoContainer.append(icon);

    let content = $('<p class="text"></p>').text(opts.options.name);

    container.append(logoContainer).append(content);

    container.on('mouseover', (e) => {
      this._isInNode = true;
      this._showEndpoints();
    });
    container.on('mouseout', (e) => {
      this._isInNode = false;
      this._hideEndpoints();
    });

    this._createIcon(container[0]);

    setTimeout(() => {
      this._addEndpoint();
    });

    return container[0];
  }
  focus = () => {
    $(this.dom).find('.logo-toolbar').addClass('show');
  }
  unFocus = () => {
    $(this.dom).find('.logo-toolbar').removeClass('show');
  }
  _createIcon(dom = this.dom) {
    let logoContainer = $('<div class="logo-toolbar"></div>');
    const boxContainer = $('<div class="box-container"></div>');
    boxContainer.append($('<div class="box"><i class="iconfont icon-yunfuwuqi"></i></div>'));
    boxContainer.append($('<div class="box"><i class="iconfont icon-webicon310"></i></div>'));
    boxContainer.append($('<div class="box"><i class="iconfont icon-renyuanguanli"></i></div>'));

    logoContainer.append(boxContainer);
    $(dom).append(logoContainer);
  }
  _addEndpoint() {}

  _showEndpoints() {
    this._endpoint.forEach((point) => {
      $(point.jsplumbObj.canvas).removeClass('hide-endpoint');
    });
  }
  _hideEndpoints() {
    setTimeout(() => {
      if (!this._isInNode && !this._isInEndpoint) {
        this._endpoint.forEach((point) => {
          $(point.jsplumbObj.canvas).addClass('hide-endpoint');
        });
      }
    }, 50);
  }
  _makeSource(dom) {
    this.makeSource({
      endpoint: {
        type: 'Dot',
        style: {radius: 1, cssClass: 'small-blue'}
      }
    }, dom);
  }
  _makeTarget(dom) {
    this.makeTarget({
      endpoint: {
        type: 'Dot',
        style: {radius: 1, cssClass: 'large-green'}
      }
    }, dom);
  }
}

export default BaseNode;
