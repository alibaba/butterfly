'use strict';
import {_calcOrientation} from './_utils.js';

const drawAdvancedBezier = (sourcePoint, targetPoint) =>  {

  if (!sourcePoint.orientation) {
    sourcePoint.orientation = _calcOrientation(targetPoint.pos[0], targetPoint.pos[1], sourcePoint.pos[0], sourcePoint.pos[1]);
  }

  if (!targetPoint.orientation) {
    targetPoint.orientation = _calcOrientation(sourcePoint.pos[0], sourcePoint.pos[1], targetPoint.pos[0], targetPoint.pos[1]);
  }

  // 控制点

  let _width = Math.abs(sourcePoint.pos[0] - targetPoint.pos[0]);
  let _height = Math.abs(sourcePoint.pos[1] - targetPoint.pos[1]);

  let _so = sourcePoint.orientation;
  let _to = targetPoint.orientation;

  const dist = Math.sqrt(_width * _width + _height * _height);
  // 控制点百分比，可转配置
  const percent = 0.25;
  // 偏差量，可转配置
  const minorDist = 30;
  let so_offsetX = 0;
  let so_offsetY = 0;
  if (_so[0] !== 0) {
    so_offsetX = (dist * percent + minorDist) * _so[0];
  } else if (_so[1] !== 0) {
    so_offsetY = (dist * percent + minorDist) * _so[1];
  }

  let to_offsetX = 0;
  let to_offsetY = 0;
  if (_to[0] !== 0) {
    to_offsetX = (dist * percent + minorDist) * _to[0];
  } else if (_to[1] !== 0) {
    to_offsetY = (dist * percent + minorDist) * _to[1];
  }

  const sourceCtrlPoint = [sourcePoint.pos[0] + so_offsetX, sourcePoint.pos[1] + so_offsetY];
  const targetCtrlPoint = [targetPoint.pos[0] + to_offsetX, targetPoint.pos[1] + to_offsetY];

  // 起始点
  let result = ['M', sourcePoint.pos[0], sourcePoint.pos[1]];
  // let result = ['M', targetPoint.pos[0], targetPoint.pos[1]];
  // 两个控制点
  result = result.concat(['C', sourceCtrlPoint[0], sourceCtrlPoint[1]], targetCtrlPoint[0], targetCtrlPoint[1]);
  // result = result.concat(['C', targetCtrlPoint[0], targetCtrlPoint[1], sourceCtrlPoint[0], sourceCtrlPoint[1]]);
  // 结束点
  result = result.concat([targetPoint.pos[0], targetPoint.pos[1]]);
  // result = result.concat([sourcePoint.pos[0], sourcePoint.pos[1]]);

  return result.join(' ');
}

export default drawAdvancedBezier;
