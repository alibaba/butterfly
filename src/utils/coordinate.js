'use strict';

const _ = require('lodash');

class CoordinateService {
  constructor(opts) {
    this.terOffsetX = opts.terOffsetX || 0;
    this.terOffsetY = opts.terOffsetY || 0;
    this.terWidth = opts.terWidth || 0;
    this.terHeight = opts.terHeight || 0;
    this.canOffsetX = opts.canOffsetX || 0;
    this.canOffsetY = opts.canOffsetY || 0;
    this.scale = opts.scale || 1;
  }

  _changeCanvasInfo(data) {
    if (data.terOffsetX) {
      this.terOffsetX = data.terOffsetX;
    }
    if (data.terOffsetY) {
      this.terOffsetY = data.terOffsetY;
    }
    if (data.terWidth) {
      this.terWidth = data.terWidth;
    }
    if (data.terHeight) {
      this.terHeight = data.terHeight;
    }
    if (data.canOffsetX) {
      this.canOffsetX = data.canOffsetX;
    }
    if (data.canOffsetY) {
      this.canOffsetY = data.canOffsetY;
    }
    if (data.scale) {
      this.scale = data.scale;
    }
  }

  canvas2terminal(pos, coordinate, options) {
    let scale = _.get(options, 'scale') || this.scale;
    let canOffsetX = _.get(options, 'canOffsetX') !== undefined ? _.get(options, 'canOffsetX') : this.canOffsetX;
    let canOffsetY = _.get(options, 'canOffsetY') !== undefined ? _.get(options, 'canOffsetY') : this.canOffsetY;
    let terOffsetX = _.get(options, 'terOffsetX') !== undefined ? _.get(options, 'terOffsetX') : this.terOffsetX;
    let terOffsetY = _.get(options, 'terOffsetY') !== undefined ? _.get(options, 'terOffsetY') : this.terOffsetY;
    if (pos === 'x') {
      const terCenter = terOffsetX + this.terWidth / 2;
      return (coordinate - this.terWidth / 2) * scale + terCenter + canOffsetX;
    }
    if (pos === 'y') {
      const terCenter = terOffsetY + this.terHeight / 2;
      return (coordinate - this.terHeight / 2) * scale + terCenter + canOffsetY;
    }
  }

  terminal2canvas(pos, coordinate, options) {
    let scale = _.get(options, 'scale') || this.scale;
    let canOffsetX = _.get(options, 'canOffsetX') !== undefined ? _.get(options, 'canOffsetX') : this.canOffsetX;
    let canOffsetY = _.get(options, 'canOffsetY') !== undefined ? _.get(options, 'canOffsetY') : this.canOffsetY;
    let terOffsetX = _.get(options, 'terOffsetX') !== undefined ? _.get(options, 'terOffsetX') : this.terOffsetX;
    let terOffsetY = _.get(options, 'terOffsetY') !== undefined ? _.get(options, 'terOffsetY') : this.terOffsetY;
    if (pos === 'x') {
      const terCenter = terOffsetX + this.terWidth / 2;
      // console.log((coordinate - terCenter - this.canOffsetX) / this.scale + this.terWidth / 2);
      return (coordinate - terCenter - canOffsetX) / scale + this.terWidth / 2;
    }
    if (pos === 'y') {
      const terCenter = terOffsetY + this.terHeight / 2;
      // console.log((coordinate - terCenter - this.canOffsetY) / this.scale + this.terHeight / 2);
      return (coordinate - terCenter - canOffsetY) / scale + this.terHeight / 2;
    }
  }
}

module.exports = CoordinateService;

// let terOffsetX = 0;
// let terOffsetY = 0;
// let terWidth = 0;
// let terHeight = 0;
// let canOffsetX = 0;
// let canOffsetY = 0;
// let scale = 1;

// function _initCanvasPos(opts) {

// }

// function canvas2terminal(data) {

// }

// function terminal2canvas(data) {
//   let {sourCoordinate, terOffset, terSize, canOffset, canScale} = data;
//   let terCenter = terOffset + terSize / 2;
//   let canCoordinate = (sourCoordinate - terCenter - canOffset) / canScale +  terSize / 2;
//   return canCoordinate;
// }

// module.exports = {
//   _initCanvasPos,
//   canvas2terminal,
//   terminal2canvas
// };
