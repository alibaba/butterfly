'use strict';

import {Edge} from 'butterfly-dag';
// import BaseEdge from '../../../../../src/edge/baseEdge';
import $ from 'jquery';
import { curveBasis, line } from 'd3-shape';

const matchFloats = /\d+\.\d+/g;

/**
 * 避障贝塞尔曲线
 */
class KedrovizEdge extends Edge {
  constructor(opts) {
    super(opts);
    this.points = opts.options.points;
    this.lineShape = line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(curveBasis);
    this.d = '';
    this.shapeType = 'Bezier';
  }

  redrawPath(points) {
    let path = points && this.limitPrecision(this.lineShape(points));
    // console.log("path",points, path);
    let resD = '';
    // 为了兼容graphviz
    let pathArr = path.split(/[L ]/);
    let lPath = pathArr[1].substring(0, pathArr[1].indexOf('C'));
    let cPath = pathArr[1].substring(pathArr[1].indexOf('C'));

    let cPathArr = cPath.replace(/([C,])/g,' ').split(' ');
    let resCPath = '';
    for (let cc = 1; cc < cPathArr.length; cc++) {
      resCPath += `${cc % 2 === 0 ? ',' : ' '}${cPathArr[cc]}`;
    }
    resD = `${pathArr[0]}L${lPath}C${resCPath.substring(1)}L${pathArr[2]}`;
    if (points.length === 6) {
      resD = `M${points[0].x},${points[0].y}L${points[5].x},${points[5].y}`
    }
    this.d = resD;

    return resD;
    // return path.replace(/,/g," ").replace(/([A-Z])/g,' $1 ').trim();
  }
  toSinglePoint(value) {return parseFloat(value).toFixed(1);}
  limitPrecision(path){ return path.replace(matchFloats, this.toSinglePoint)};
  calcPath(sourcePoint, targetPoint) {    
    this.emit('custom',{
      type: "edge:calcPath",
      data: this
    });
   
    let _points = this.points;
    // let sourceOrientation = (sourcePoint.orientation)[0] + (sourcePoint.orientation)[1];
    // let sourceXDistant = 0;
    // let sourceYDistant = 0;
    // let targetXDistant = 0;
    // let targetYDistant = 0;
    // targetXDistant = (targetPoint.pos)[0] - _points[0].x;
    // targetYDistant = (targetPoint.pos)[1] - _points[0].y;
    // sourceXDistant = (sourcePoint.pos)[0] - _points[_points.length-1].x;
    // sourceYDistant = (sourcePoint.pos)[1] - _points[_points.length-1].y;
    // _points.forEach((item, index) => {
    //   if (index < _points.length / 2) {
    //     item.x = item.x + targetXDistant;
    //     item.y = item.y + targetYDistant;
    //   } else {
    //     item.x = item.x + sourceXDistant;
    //     item.y = item.y + sourceYDistant;
    //   }
    // });

    // _points.reverse();

    return this.redrawPath(_points);
  }
}

export default KedrovizEdge;
