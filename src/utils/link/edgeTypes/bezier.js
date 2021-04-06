'use strict';
import {_findControlPoint, _calcOrientation} from './_utils.js';

function drawBezier(sourcePoint, targetPoint) {

  if (!sourcePoint.orientation) {
    sourcePoint.orientation = _calcOrientation(targetPoint.pos[0], targetPoint.pos[1], sourcePoint.pos[0], sourcePoint.pos[1]);
  }

  if (!targetPoint.orientation) {
    targetPoint.orientation = _calcOrientation(sourcePoint.pos[0], sourcePoint.pos[1], targetPoint.pos[0], targetPoint.pos[1]);
  }

  // 控制点

  let _width = Math.abs(sourcePoint.pos[0] - targetPoint.pos[0]);
  let _height = Math.abs(sourcePoint.pos[1] - targetPoint.pos[1]);

  let _sx = sourcePoint.pos[0] < targetPoint.pos[0] ? _width : 0;
  let _sy = sourcePoint.pos[1] < targetPoint.pos[1] ? _height : 0;
  let _tx = sourcePoint.pos[0] < targetPoint.pos[0] ? 0 : _width;
  let _ty = sourcePoint.pos[1] < targetPoint.pos[1] ? 0 : _height;
  let _so = sourcePoint.orientation;
  let _to = targetPoint.orientation;

  let sourceCtrlPoint = _findControlPoint([_sx, _sy], sourcePoint, targetPoint, _so, _to);
  let targetCtrlPoint = _findControlPoint([_tx, _ty], targetPoint, sourcePoint, _to, _so);


  let offsetX = sourcePoint.pos[0] < targetPoint.pos[0] ? sourcePoint.pos[0] : targetPoint.pos[0];
  let offsetY = sourcePoint.pos[1] < targetPoint.pos[1] ? sourcePoint.pos[1] : targetPoint.pos[1];

  sourceCtrlPoint = [sourceCtrlPoint[0] + offsetX, sourceCtrlPoint[1] + offsetY];
  targetCtrlPoint = [targetCtrlPoint[0] + offsetX, targetCtrlPoint[1] + offsetY];

  // 起始点
  let result = ['M', sourcePoint.pos[0], sourcePoint.pos[1]];
  // 两个控制点
  result = result.concat(['C', targetCtrlPoint[0], targetCtrlPoint[1], sourceCtrlPoint[0], sourceCtrlPoint[1]]);
  // 结束点
  result = result.concat([targetPoint.pos[0], targetPoint.pos[1]]);

  return result.join(' ');
}

export default drawBezier;
