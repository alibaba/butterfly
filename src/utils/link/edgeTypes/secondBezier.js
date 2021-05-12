'use strict';
import {_calcOrientation, _findSecondControlPoint} from './_utils.js';

const drawSecondBezier = (sourcePoint, targetPoint, shapeType) => {
  if (!sourcePoint.orientation) {
    sourcePoint.orientation = _calcOrientation(targetPoint.pos[0], targetPoint.pos[1], sourcePoint.pos[0], sourcePoint.pos[1]);
  }

  if (!targetPoint.orientation) {
    targetPoint.orientation = _calcOrientation(sourcePoint.pos[0], sourcePoint.pos[1], targetPoint.pos[0], targetPoint.pos[1]);
  }

  // 控制点
  
  let _so = sourcePoint.orientation;
  let _to = targetPoint.orientation;
  let ctrlPoint = _findSecondControlPoint(sourcePoint, targetPoint, _so, _to, shapeType);
  // 起始点
  let result = ['M', sourcePoint.pos[0], sourcePoint.pos[1]];
  result = result.concat(['Q', ctrlPoint[0], ctrlPoint[1]]);
  // 结束点
  result = result.concat([targetPoint.pos[0], targetPoint.pos[1]]);
  return result.join(' ');
}

export default drawSecondBezier;
