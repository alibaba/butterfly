'use strict';

import _ from 'lodash';

function fishboneLayout(params) {
  const _biasAngle = _.get(params, 'options.biasAngle', Math.PI / 3);
  const FISH_SIN = Math.sin(_biasAngle),
    FISH_COS = Math.cos(_biasAngle);
  const _data = _.get(params, 'data', null);
  const _mode = _.get(params, 'options.mode', 'coincide');
  const _direction = _.get(params, 'options.direction', 'LR');
  const _isReversed = (_direction === 'RL');

  const _left = _.get(params, 'options.left', 0),
    _top = _.get(params, 'options.top', 0);
  const _mainAxisLength = _.get(params, 'options.mainAxisLength', 2000);
  const _mainAxisNodeDistance = _.get(params, 'options.mainAxisNodeDistance', 300);
  const _renderNodes = [], _renderEdges = [];

  console.assert(_data !== undefined);

  // 设置节点的深度
  const setNodeDepth = (item, depth) => {
    item.depth = depth;
    if (item.children === undefined) return;
    for (let cc of item.children) {
      setNodeDepth(cc, depth + 1);
    }
  };

  // 根据两组坐标，向数组中添加即将渲染的点和边
  /**
   * 
   * @param {number} 被指向node的x坐标
   * @param {number} 被指向node的y坐标
   * @param {string} 被指向node的label
   * @param {number} 指向node的x坐标 
   * @param {number} 指向node的y坐标
   * @param {string} 指向node的label 
   * @param {number} 边的深度
   */
  const addEdges = (x1, y1, label1, x2, y2, label2, depth) => {
    let nextNodeId = _renderNodes.length;
    // 将来添加到渲染树中的node和edge，适配后即可使用
    // _renderNodes.push({
    //     id: nextNodeId + 1,
    //     top: y2,
    //     left: x2,
    //     label: label2,
    //     depth: depth
    // });
    // _renderEdges.push({
    //     source: [x2, y2],
    //     target: [x1, y1],
    //     path: 'M ' + x2 + ' ' + y2 + ' L ' + x1 + ' ' + y1
    // });
    // 即将渲染的边和渲染边使用的点加入到数组中
    _renderNodes.push({
      id: nextNodeId,
      top: y1,
      left: x1,
      label: label1,
      endpoints: [{
        id: 'a',
        orientation: [0, 0],
        pos: [0.5, 0.5]
      }],
      depth: depth
    });
    _renderNodes.push({
      id: nextNodeId + 1,
      top: y2,
      left: x2,
      label: label2,
      endpoints: [{
        id: 'a',
        orientation: [0, 0],
        pos: [0.5, 0.5]
      }],
      depth: depth
    });
    _renderEdges.push({
      // id: _renderEdges.length,
      source: 'a',
      target: 'a',
      sourceNode: nextNodeId + 1,
      targetNode: nextNodeId,
      type: 'endpoint',
      depth: depth,
      arrow: true,
      arrowPosition: 0.95,
    });
  };

  // 设置2级及之后的子节点位置
  /**
   * 
   * @param {object} 开始遍历的节点
   * @param {number} 遍历节点的虚拟x坐标
   * @param {number} 遍历节点的虚拟y坐标
   * @param {bool} 是否上下翻转，默认朝下
   * @returns 
   */
  const setMinorNodePos = (item, xIndex, yIndex, isUpDownReversed = false) => {
    // 每个节点所占的宽度
    let childrenCanvasLength = _.get(params, 'options.childCanvasLenth', 70);
    // n级节点相对于n-1级节点相差的x大小
    let childxIndexRelateToParent = _.get(params, 'options.childxIndexRelateToParent', 100);

    // 节点的坐标x和y赋值
    if (_isReversed) {
      item.xIndex = 2 * _left - xIndex;
    } else {
      item.xIndex = xIndex;
    }
    if (isUpDownReversed) {
      item.yIndex = 2 * _top - yIndex;
    } else {
      item.yIndex = yIndex;
    }
    if (item.depth != 1) {
      // 非1级节点，需要创建一条横边来承载孩子
      addEdges(
        item.xIndex, item.yIndex, '空',
        item.xIndex - (_.get(params, 'options.childHorizontalEdgeLength', 400))
          * (_isReversed ? -1 : 1),
        item.yIndex, item.text, item.depth
      );
    } else {
      // 如果是1级节点的孩子，则不需要进行那一段水平位移
      childxIndexRelateToParent = 0;
    }
    if (item.children === undefined) {
      return childrenCanvasLength;
    }
    for (let cc of item.children) {
      childrenCanvasLength += setMinorNodePos(
        cc,
        xIndex - childrenCanvasLength * FISH_COS - childxIndexRelateToParent,
        yIndex + childrenCanvasLength * FISH_SIN,
        isUpDownReversed
      );
    }
    item.childrenCanvasLength = childrenCanvasLength;
    if (item.depth != 1) {
      let tmpDecreasement = _.get(params, 'options.biasLineDecreaseLength', 10);
      addEdges(
        item.xIndex - childxIndexRelateToParent * (_isReversed ? -1 : 1),
        item.yIndex,
        '星',
        item.xIndex +
        (- childxIndexRelateToParent - childrenCanvasLength * FISH_COS
          + tmpDecreasement)
        * (_isReversed ? -1 : 1),
        item.yIndex +
        (childrenCanvasLength * FISH_SIN - tmpDecreasement)
        * (isUpDownReversed ? -1 : 1),
        item.text,
        item.depth
      );
    }
    return childrenCanvasLength;
  };

  // 设置1级子节点的位置
  /**
   * 
   * @param {object} 主节点
   * @param {number} 主节点的x坐标
   * @param {number} 主节点的y坐标 
   */
  const setMajorNodePos = (item, xIndex, yIndex) => {
    setNodeDepth(_data, 0);
    // 主轴绘制
    addEdges(
      xIndex, yIndex, '主轴',
      xIndex - _mainAxisLength * (_isReversed ? -1 : 1), yIndex, '主轴',
      0
    );
    let isDown = false;
    for (let cc = 0; cc < item.children.length; cc++) {
      let tmpItem = item.children[cc];
      switch (_mode) {
        case 'coincide':
          tmpItem.xIndex = xIndex - (cc + (cc % 2 === 0 ? 1 : 0)) * _mainAxisNodeDistance;
          break;
        case 'space-even':
          tmpItem.xIndex = xIndex - (cc + 1) * _mainAxisNodeDistance;
          break;
        default:
          console.error('Error: Fishbone layout mode is not defined.');
          break;
      }
      tmpItem.yIndex = yIndex;
      let childLength = setMinorNodePos(
        tmpItem, tmpItem.xIndex, tmpItem.yIndex, !isDown
      );
      addEdges(
        tmpItem.xIndex, tmpItem.yIndex, '月',
        tmpItem.xIndex - childLength * FISH_COS * (_isReversed ? -1 : 1),
        tmpItem.yIndex + childLength * FISH_SIN * (isDown ? 1 : -1),
        tmpItem.text, tmpItem.depth
      );
      isDown = !isDown;
    }
  };


  setMajorNodePos(_data, _left, _top);
  return {
    nodes: _renderNodes,
    edges: _renderEdges
  };
}

export default fishboneLayout;
