'use strict';

const Node = require('../../../index.js').Node;
const $ = require('jquery');

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
  }
  mounted() {

    // 假如菱形的话定制锚点，可指定任意的dom为endopoint
    // console.log(this)
    if (this.options.shape === 'diamond') {
      let pointPos = ['top', 'right', 'bottom', 'left'];
      pointPos.forEach((pos, index) => {
        let point = $(`<div class='butterflie-circle-endpoint ${pos}'></div>`);
        $(this.dom).append(point);
        let obj = {
          id: `${pos}`,
          orientation: [pointPos.indexOf(pos) % 1 === 1 ? 1 : 0, pointPos.indexOf(pos) % 1 === 1 ? 0 : 1],
          dom: point[0]
        };
        if (pos === 'top') {
          obj.orientation = [0, -1];
        } else if (pos === 'right') {
          obj.orientation = [1, 0];
        } else if (pos === 'bottom') {
          obj.orientation = [0, 1];
        } else if (pos === 'left'){
          obj.orientation = [-1, 0];
        }
        this.addEndpoint(obj);
      });
    }

    // 把锚点添加颜色
    if (this.endpoints && this.endpoints.length > 0) {
      this.endpoints.forEach((point) => {
        $(point.dom).addClass(this.options.color);
      })
    }
  }
  draw = (data) => {
    let container = $('<div class="base-node"></div>')
      .css('top', data.top)
      .css('left', data.left)
      .attr('id', data.id);
    
    // 添加颜色
    if (data.options.color) {
      container.addClass(data.options.color);
    }

    // 添加外边框
    if (data.options.border) {
      container.addClass(data.options.border);
    }

    // 渲染外形
    container.addClass(data.options.shape);

    //有外边框的椭圆
    if (data.options.ellipseBorderWidth) {
      const width = data.options.width / 2;
      const height = data.options.height / 2;
      const strokeWidth = data.options.ellipseBorderWidth;
      const fill = data.options.fill;
      let ellipseSvg = $(`
        <svg width="100%" height="100%">
          <ellipse cx="${width}" cy="${height}" rx="${width - 2}" ry="${height - 2}" style="fill:#fff;
                  stroke:${fill};stroke-width:${strokeWidth}; stroke-dasharray:${data.options.ellipseDasharray}" />
          <ellipse cx="${width}" cy="${height}" rx="${width - 4 - strokeWidth}" ry="${height - 3 - strokeWidth}" style="fill:${fill}" />
        </svg>`);
      container.append(ellipseSvg);
      container.addClass('transparent');
    }

    // 有边框的rect
    if (data.options.rectBorderWidth) {
      const width = data.options.width;
      const height = data.options.height;
      const strokeWidth = data.options.rectBorderWidth;
      const fill = data.options.fill;
      let diamondSvg = $(`
        <svg width="100%" height="100%">
          <rect x="${strokeWidth}" y="${strokeWidth}" width="${width - strokeWidth * 2}" height="${height - strokeWidth * 2}" style="fill:#fff;
                          stroke:${fill};stroke-width:${strokeWidth}" />
          <rect x="${strokeWidth + 3}" y="${strokeWidth + 3}" width="${width - strokeWidth * 2 - 6}" height="${height - strokeWidth * 2 - 6}" style="fill:${fill}" />
        </svg>`);
      container.append(diamondSvg);
      container.addClass('transparent');
    }

    // 三角形
    if (data.options.shape === 'triangle') {
      const width = data.options.width;
      const height = data.options.height;
      let triangleSvg = $(`
        <svg width="100%" height="100%">
          <polygon points="0,0 ${width},0 ${width / 2},${height}"
          style="fill:${data.options.fill};"/>
        </svg>`);
      container.append(triangleSvg);
    }

    // 添加文字
    let textSpan = $(`<span class='text'>${data.options.text}</span>`);
    if (data.options.shape === 'diamond') {
      textSpan.addClass('rotate');
    }
    if (data.options.shape === 'triangle') {
      textSpan.addClass('triangle-text');
    }
    container.append(textSpan);

    return container[0];
  }
}

module.exports = BaseNode;
