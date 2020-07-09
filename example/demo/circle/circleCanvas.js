'use strict';

const Canvas = require('../../../index.js').Canvas;
const Group = require('./group');
const NoteSourceNode = require('./noteSourceNode.js');
const NoteTargetNode = require('./noteTargetNode.js');
const $ = require('jquery');

class CircleCanvas extends Canvas {
  draw(opts, callback) {
    let _groups = opts.groups;
    opts.groups = [];
    opts.nodes = _.sortBy(opts.nodes, (o) => {
      return o._group;
    });
    super.draw(opts, () => {
      this.addCircleGroups(_groups);
      this.addNotes(opts.notes);
      callback && callback();
      opts.groups = _groups;
      // 环绕节点组的一圈环
      this._drawCirlce();
    });
  }
  _drawCirlce() {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('class', 'orange-circle');
    circle.setAttribute('cx', '0');
    circle.setAttribute('cy', '7');
    circle.setAttribute('r', '200');
    $(this.svg).append(circle);
  }
  addCircleGroups(groups) {
    let circleNodesNum = this.nodes.filter((item) => {
      return item.options._isCircle;
    }).length;
    let perAngle = 360 / circleNodesNum;
    let radius = _.get(this, 'layout.options.radius');

    groups.forEach((obj) => {
      let nodes = this.nodes.filter((item) => {
        return item.options._group === obj.id;
      });
      // 查找扇形弧度
      let minAngle = Infinity;
      let maxAngle = -Infinity;
      nodes.forEach((item) => {
        if (item.options.posInfo.angle < minAngle) {
          minAngle = item.options.posInfo.angle;
        }
        if (item.options.posInfo.angle > maxAngle) {
          maxAngle = item.options.posInfo.angle;
        }
      });

      minAngle = minAngle - 5;
      maxAngle = maxAngle + 5;
      // 记录扇形的直径
      obj.posInfo = {
        innerRadius: 200,
        outterRadius: 350,
        outter2Radius: 360,
        minAngle: minAngle,
        maxAngle: maxAngle
      };
      obj.Class = Group;

      // 计算扇形的路径
      function _calcRadius(_obj, key, radius) {
        let radian = (2 * Math.PI) / 360;
        // 开始坐标
        let _top1 = parseInt(radius * Math.sin(_obj.posInfo.minAngle * radian));
        let _left1 = parseInt(radius * Math.cos(_obj.posInfo.minAngle * radian));
        // 结束坐标
        let _top2 = parseInt(radius * Math.sin(_obj.posInfo.maxAngle * radian));
        let _left2 = parseInt(radius * Math.cos(_obj.posInfo.maxAngle * radian));
        // 中间坐标
        let _top3 = parseInt(radius * Math.sin((_obj.posInfo.minAngle + _obj.posInfo.maxAngle) / 2 * radian));
        let _left3 = parseInt(radius * Math.cos((_obj.posInfo.minAngle + _obj.posInfo.maxAngle) / 2 * radian));
        _obj.posInfo[key] = [_left1, _top1, _left2, _top2, _left3, _top3];
      }
      _calcRadius(obj, 'innerPos', obj.posInfo.innerRadius);
      _calcRadius(obj, 'outterPos', obj.posInfo.outterRadius);
      _calcRadius(obj, 'outter2Pos', obj.posInfo.outter2Radius);
    });
    this.addGroups(groups);
  }
  addNotes(notes) {
    notes.forEach((note, index) => {
      let group = this.getGroup(note._group);
      // opts.options.posInfo.outterPos[0], opts.options.posInfo.outterPos[1]
      const leftSideX = -500;
      const rightSideX = 500;
      this.addNodes([{
        id: `note-source-${index}`,
        top: group.options.posInfo.outter2Pos[5],
        left: group.options.posInfo.outter2Pos[4],
        Class: NoteSourceNode,
        _group: group
      }, {
        id: `note-target-${index}`,
        top: group.options.posInfo.outterPos[5],
        left: group.options.posInfo.outterPos[4] > 0 ? rightSideX: leftSideX,
        side: group.options.posInfo.outterPos[4] > 0 ? 'right': 'left',
        Class: NoteTargetNode,
        text: note.text
      }]);
      this.addEdge({
        id: `note-${index}`,
        source: `note-source-${index}`,
        target: `note-target-${index}`
      })
    });
  }
}

module.exports = CircleCanvas;