'use strict';

import {Edge} from 'butterfly-dag';
import $ from 'jquery';

class BaseEdge extends Edge {
  constructor(opts) {
    super(opts);
    this.d = opts.options.d;
    this.source = opts.options.trueSource;
    this.target = opts.options.trueTarget;
    this.shapeType = 'Bezier';
  }
  draw(obj) {
    let path = super.draw(obj);
    if (this.options.color) {
      $(path).addClass(this.options.color);
    }
    return path;
  }
  redraw(obj) {
    let path = super.redraw(obj);
    if (this.options.color) {
      $(path).addClass(this.options.color);
    }
    return path;
  }
  drawArrow(isShow) {
    let dom = super.drawArrow(isShow);
    if (this.options.color) {
      $(dom).addClass(this.options.color);
    }
    return dom;
  }
  drawLabel(text) {
    let dom = null;
    if (text) {
      dom = $(`<i class="newIconfont iconjiandao-tianchong label ${text}"></i>`)[0];
    }
    return dom;
  }
  redrawPath(d, sourcePoint, targetPoint) {
    const originD = d.split(/[ MC]/).filter(ele => ele !== '');
    const startX = sourcePoint.pos[0];
    const startY = sourcePoint.pos[1];
    const endX = targetPoint.pos[0];
    const endY = targetPoint.pos[1];
    const startMoveX = parseFloat(originD[0].split(',')[0]) - startX;
    const startMoveY = parseFloat(originD[0].split(',')[1]) - startY;
    // 将edge移动到起点
    const movedD = originD.map(ele => {
      return (parseFloat(ele.split(',')[0]) - startMoveX) + ',' + (parseFloat(ele.split(',')[1]) - startMoveY)
    });
    const endMoveX = parseFloat(movedD[movedD.length - 1].split(',')[0]) - endX;
    const endMoveY = parseFloat(movedD[movedD.length - 1].split(',')[1]) - endY;
    const totalLength = Math.sqrt(Math.pow((endX - startX), 2) + Math.pow((endY - startY), 2));
    // 终点做坐标变换
    const movedD2 = [];
    for (let cc of movedD) {
      movedD2.push('');
    }
    movedD2[0] = movedD[0];
    //先计算完成端点坐标
    for (let cc = 3; cc < movedD.length; cc += 3) {
      if (cc === movedD.length - 1) {
        movedD2[cc] = `${endX},${endY}`;
      } else {
        const originX = parseFloat(movedD[cc].split(',')[0]);
        const originY = parseFloat(movedD[cc].split(',')[1]);
        movedD2[cc] = (originX - endMoveX * Math.sqrt(Math.pow((originX - startX), 2) + Math.pow((originY - startY), 2)) / totalLength)
          + ','
          + (originY - endMoveY * Math.sqrt(Math.pow((originX - startX), 2) + Math.pow((originY - startY), 2)) / totalLength)
      }
    }
    for (let cc = 1; cc < movedD.length; cc++) {
      if (cc % 3 === 0) {
        continue;
      }
      const pointStart = (Math.floor(cc / 3)) * 3;
      const pointFinal = (Math.floor(cc / 3) + 1) * 3;
      const ccPrev = movedD[cc].split(',').map(c => parseFloat(c));
      const startPrev = movedD[pointStart].split(',').map(c => parseFloat(c));
      const startCurr = movedD2[pointStart].split(',').map(c => parseFloat(c));
      const endPrev = movedD[pointFinal].split(',').map(c => parseFloat(c));
      const endCurr = movedD2[pointFinal].split(',').map(c => parseFloat(c));
      const k = Math.sqrt(Math.pow(ccPrev[0] - startPrev[0], 2) + Math.pow(ccPrev[1] - startPrev[1], 2)) /
        Math.sqrt(Math.pow(endPrev[0] - startPrev[0], 2) + Math.pow(endPrev[1] - startPrev[1], 2));
      const ccCurrX = ccPrev[0] + startCurr[0] - startPrev[0] + (endCurr[0] - (startCurr[0] - startPrev[0]) - endPrev[0]) * k;
      const ccCurrY = ccPrev[1] + startCurr[1] - startPrev[1] + (endCurr[1] - (startCurr[1] - startPrev[1]) - endPrev[1]) * k;
      movedD2[cc] = `${ccCurrX},${ccCurrY}`;
    }

    
    // const tmovedD2 = movedD.map((ele, idx) => {
    //   const originX = parseFloat(ele.split(',')[0]);
    //   const originY = parseFloat(ele.split(',')[1]);
    //   if (idx === 0) {
    //     return `${originX},${originY}`;
    //   }



    //   if ((originX - startX) * (endX - startX) < 0 && idx < originD.length - 1) {
    //     return originX
    //       + ','
    //       + (originY - endMoveY * Math.sqrt(Math.pow((originX - startX), 2) + Math.pow((originY - startY), 2)) / totalLength)
    //   } else if (idx === originD.length - 1) {
    //     return (originX - endMoveX) + ',' + (originY - endMoveY)
    //   }
    //   return (originX - endMoveX * Math.sqrt(Math.pow((originX - startX), 2) + Math.pow((originY - startY), 2)) / totalLength)
    //     + ','
    //     + (originY - endMoveY * Math.sqrt(Math.pow((originX - startX), 2) + Math.pow((originY - startY), 2)) / totalLength)
    // })
    // 优化坐标结构，斜率相同移除
    // const movedD3 = [];
    // for (let cc of movedD2) {
    //   if (movedD3.length < 2) {
    //     movedD3.push(cc);
    //   } else {
    //     const ccX = parseFloat(cc.split(',')[0]);
    //     const ccY = parseFloat(cc.split(',')[1]);
    //     const lstX = parseFloat(movedD3[movedD3.length - 1].split(',')[0]);
    //     const lstY = parseFloat(movedD3[movedD3.length - 1].split(',')[1]);
    //     const k1 = (ccY - lstY) / (ccX - lstX);
    //     const k2 = (lstY - parseFloat(movedD3[movedD3.length - 2].split(',')[1])) / (lstX - parseFloat(movedD3[movedD3.length - 2].split(',')[0]));
    //     if (k2 / k1 <= 1.01 && k1 / k2 <= 1.01) {
    //       movedD3.pop();
    //     }
    //     movedD3.push(cc);
    //   }
    // }
    let finalValue = ''
    for (let cc = 0; cc < movedD2.length; cc++) {
      if (cc === 0) {
        finalValue += `M${movedD2[cc]}C`;
      } else if (cc !== movedD2.length - 1){
        finalValue += `${movedD2[cc]} `;
      } else {
        finalValue += `${movedD2[cc]}`;
      }
    }
    return finalValue;
  }
  calcPath(sourcePoint, targetPoint) {
    if (this.source === this.target) {
      return '';
    }
    this.d = this.redrawPath(this.d, sourcePoint, targetPoint);
    return this.d;
  }
}

export default BaseEdge;
