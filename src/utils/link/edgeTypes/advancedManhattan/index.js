'use strict';

import _ from 'lodash';
import {getAvoidObstaclesInfo, _calcOrientation, _route} from '../_utils'; 
import ObstacleMap from './obstacleMap';

const orientationOffet = (pos, orientation, girdGap) => {
  let _ori = orientation.toString();
  let res = pos;
  if (_ori === '0,1') {
    res[1] += girdGap;
  } else if (_ori === '0,-1') {
    res[1] -= girdGap;
  } else if (_ori === '1,0') {
    res[0] += girdGap;
  } else if (_ori === '-1,0') {
    res[0] -= girdGap;
  }
  return res;
}

// 寻找路
const findPath = (map, startPoint, endPoint) => {

}

// todo options暂时先写死
function drawAdvancedManhattan (sourcePoint, targetPoint, options) {

  let canvasData = getAvoidObstaclesInfo();

  // 后续可以优化这个内存
  let obstacleMap = new ObstacleMap();
  obstacleMap.build(canvasData.nodes);

  console.log(sourcePoint);

  // 寻找start、end的网格节点
  let startPoint = [obstacleMap.round(sourcePoint.pos[0]), obstacleMap.round(sourcePoint.pos[1])];
  let endPoint = [obstacleMap.round(targetPoint.pos[0]), obstacleMap.round(targetPoint.pos[1])];

  // 按照方向偏移一格
  startPoint = orientationOffet(startPoint, sourcePoint.orientation, obstacleMap.options.girdGap);
  endPoint = orientationOffet(endPoint, targetPoint.orientation, obstacleMap.options.girdGap);

  console.log(startPoint);
  console.log(endPoint);

  return {
    path: [],
    breakPoints: []
  };
}

export default drawAdvancedManhattan;