import {Group} from 'butterfly-dag';
import $ from 'jquery';

import './group.less';
class BaseGroup extends Group {
  constructor(opts) {
    super(opts);
    this.options = opts;
    this.titlePath = undefined;
  }
  draw = (opts) => {
    // 坐标需要计算
    let container = $('<div class="annulus-group"></div>')
      .attr('id', opts.id)
      .css('top', opts.top + 'px')
      .css('left', opts.left + 'px');

    let svg = $(`<svg class="group-svg"></svg>`);

    let titlePathData = [
      'M', opts.options.posInfo.outterPos[0], opts.options.posInfo.outterPos[1],
      'A', opts.options.posInfo.outterRadius, opts.options.posInfo.outterRadius, 0, 0, 1, opts.options.posInfo.outterPos[2], opts.options.posInfo.outterPos[3],
      'L', opts.options.posInfo.outter2Pos[2], opts.options.posInfo.outter2Pos[3],
      'A', opts.options.posInfo.outter2Radius, opts.options.posInfo.outter2Radius, 0, 0, 0, opts.options.posInfo.outter2Pos[0], opts.options.posInfo.outter2Pos[1],
    ];

    let titlePath = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
      .attr('d', titlePathData.join(' '))
      .css('fill', opts.options.color)
      .addClass('group-title-path');


    let containerPathData = [
      'M', opts.options.posInfo.outter2Pos[0], opts.options.posInfo.outter2Pos[1],
      'A', opts.options.posInfo.outter2Radius, opts.options.posInfo.outter2Radius, 0, 0, 1, opts.options.posInfo.outter2Pos[2], opts.options.posInfo.outter2Pos[3],
      'L', opts.options.posInfo.innerPos[2], opts.options.posInfo.innerPos[3],
      'A', opts.options.posInfo.innerRadius, opts.options.posInfo.innerRadius, 0, 0, 0, opts.options.posInfo.innerPos[0], opts.options.posInfo.innerPos[1],
    ];

    let containerPath = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
      .attr('d', containerPathData.join(' '))
      .addClass('group-container-path');

    this.titlePath = titlePath[0];

    svg.append(containerPath[0]);

    svg.append(titlePath[0]);


    container.append(svg);
    return container[0];
  }
}

export default BaseGroup;
