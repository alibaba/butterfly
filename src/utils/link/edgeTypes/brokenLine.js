'use strict';
import { _calcOrientation } from './_utils.js';

const drawBrokenLine = (sourcePoint, targetPoint) => {
    if (!sourcePoint.orientation) {
        sourcePoint.orientation = _calcOrientation(targetPoint.pos[0], targetPoint.pos[1], sourcePoint.pos[0],
            sourcePoint.pos[1]);
    }

    if (!targetPoint.orientation) {
        targetPoint.orientation = _calcOrientation(sourcePoint.pos[0], sourcePoint.pos[1], targetPoint.pos[0],
            targetPoint.pos[1]);
    }

    let _so = sourcePoint.orientation;
    let _to = targetPoint.orientation;
    let distX = Math.abs(sourcePoint.pos[0] - targetPoint.pos[0]);
    let distY = Math.abs(sourcePoint.pos[1] - targetPoint.pos[1]);
    let inflectionPoint = [];

    // 起始点
    let result = ['M', sourcePoint.pos[0], sourcePoint.pos[1]];

    //正常情况
    inflectionPoint = [targetPoint.pos[0] + distX * 0.2 * _to[0], targetPoint.pos[1] + distY * 0.2 * _to[1]];

    //水平
    if (targetPoint.pos[1] === sourcePoint.pos[1] || targetPoint.pos[0] === sourcePoint.pos[0]) {
        inflectionPoint = [];
    }

    //特殊情况
    let sourceInflectionPoint = [];
    if (_so[0] === -1 && targetPoint.pos[0] > sourcePoint.pos[0] ||
        _so[0] === 1 && targetPoint.pos[0] < sourcePoint.pos[0] ||
        _so[1] === 1 && targetPoint.pos[1] < sourcePoint.pos[1] ||
        _so[1] === -1 && targetPoint.pos[1] > sourcePoint.pos[1]) {
        inflectionPoint = [];
        sourceInflectionPoint = [sourcePoint.pos[0] + distX * 0.2 * _so[0], sourcePoint.pos[1] + distY * 0.2 * _so[1]];
        if (_so[0] * _to[0] === -1 || _so[1] * _to[1] === -1) {
            inflectionPoint = [targetPoint.pos[0] + distX * 0.2 * _to[0], targetPoint.pos[1] + distY * 0.2 * _to[1]];
        }
    }

    if (sourceInflectionPoint.length) {
        result = _so[0] ? result.concat(['H', sourceInflectionPoint[0]]) : result.concat(['V', sourceInflectionPoint[1]]);
    }
    if (inflectionPoint.length) {
        result = result.concat(['L', inflectionPoint[0], inflectionPoint[1]]);
    }

    // 结束点
    if (sourceInflectionPoint.length && !inflectionPoint.length) {
        result = result.concat(['L', targetPoint.pos[0], targetPoint.pos[1]]);
    } else {
        result = _to[0] ? result.concat(['H', targetPoint.pos[0]]) : result.concat(['V', targetPoint.pos[1]]);
    }
    return result.join(' ');
}

export default drawBrokenLine;
