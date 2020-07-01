'use strict';

const Canvas = require('../../../index.js').Canvas;
const Group = require('./group');

class CircleCanvas extends Canvas {
  draw(opts, callback) {
    let _groups = opts.groups;
    opts.groups = [];
    opts.nodes = _.sortBy(opts.nodes, (o) => {
      return o._group;
    });
    super.draw(opts, () => {
      this.addCircleGroups(_groups);
      callback && callback();
      opts.groups = _groups;
    });
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
        outter2Radius: 345,
        minAngle: minAngle,
        maxAngle: maxAngle
      };
      obj.Class = Group;

      // 计算扇形的路径
      function _calcRadius(_obj, key, radius) {
        let radian = (2 * Math.PI) / 360;
        let _top1 = parseInt(radius * Math.sin(_obj.posInfo.minAngle * radian));
        let _left1 = parseInt(radius * Math.cos(_obj.posInfo.minAngle * radian));
        let _top2 = parseInt(radius * Math.sin(_obj.posInfo.maxAngle * radian));
        let _left2 = parseInt(radius * Math.cos(_obj.posInfo.maxAngle * radian));
        _obj.posInfo[key] = [_left1, _top1, _left2, _top2];
      }
      _calcRadius(obj, 'innerPos', obj.posInfo.innerRadius);
      _calcRadius(obj, 'outterPos', obj.posInfo.outterRadius);
      _calcRadius(obj, 'outter2Pos', obj.posInfo.outter2Radius);
    });
    this.addGroups(groups);
  }
}

module.exports = CircleCanvas;