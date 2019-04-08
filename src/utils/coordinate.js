'use strict';

const _ = require('lodash');

class CoordinateService {
  constructor(opts) {
    this.wrapper = opts.wrapper;
    this.girdWrapper = opts.girdWrapper;
    this.terOffsetX = opts.terOffsetX || 0;
    this.terOffsetY = opts.terOffsetY || 0;
    this.terWidth = opts.terWidth || 0;
    this.terHeight = opts.terHeight || 0;
    this.canOffsetX = opts.canOffsetX || 0;
    this.canOffsetY = opts.canOffsetY || 0;
    this.scale = opts.scale || 1;
    this.transformOriginX = this.terWidth / 2;
    this.transformOriginY = this.terHeight / 2;
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
    if (data.wrapper) {
      this.wrapper = data.wrapper;
    }
    if (data.girdWrapper) {
      this.girdWrapper = data.girdWrapper;
    }
    let _istransformOriginXChange = false;
    if (data.mouseX) {
      if (this.transformOriginX !== data.mouseX - this.terOffsetX) {
        this.transformOriginX = data.mouseX - this.terOffsetX;
        _istransformOriginXChange = true;
      }
    }
    if (data.mouseY) {
      if (this.transformOriginY !== data.mouseY - this.terOffsetY) {
        this.transformOriginY = data.mouseY - this.terOffsetY;
        _istransformOriginXChange = true;
      }
    }
    if (_istransformOriginXChange) {
      this.wrapper.style.transformOrigin = `${this.transformOriginX}px ${this.transformOriginY}px`;
      this.girdWrapper.style.transformOrigin = `${this.transformOriginX}px ${this.transformOriginY}px`;
    }
  }
  canvas2terminal(coordinates, options) {
    return [this._canvas2terminal('x', coordinates[0], options), this._canvas2terminal('y', coordinates[1], options)];
  }
  terminal2canvas(coordinates, options) {
    return [this._terminal2canvas('x', coordinates[0], options), this._terminal2canvas('y', coordinates[1], options)];
  }
  _canvas2terminal(pos, coordinate, options) {
    let scale = _.get(options, 'scale') || this.scale;
    let canOffsetX = _.get(options, 'canOffsetX') !== undefined ? _.get(options, 'canOffsetX') : this.canOffsetX;
    let canOffsetY = _.get(options, 'canOffsetY') !== undefined ? _.get(options, 'canOffsetY') : this.canOffsetY;
    let terOffsetX = _.get(options, 'terOffsetX') !== undefined ? _.get(options, 'terOffsetX') : this.terOffsetX;
    let terOffsetY = _.get(options, 'terOffsetY') !== undefined ? _.get(options, 'terOffsetY') : this.terOffsetY;
    if (pos === 'x') {
      const terCenter = terOffsetX + this.transformOriginX;
      return (coordinate - this.transformOriginX) * scale + terCenter + canOffsetX;
    }
    if (pos === 'y') {
      const terCenter = terOffsetY + this.transformOriginY;
      return (coordinate - this.transformOriginY) * scale + terCenter + canOffsetY;
    }
  }

  _terminal2canvas(pos, coordinate, options) {
    let scale = _.get(options, 'scale') || this.scale;
    let canOffsetX = _.get(options, 'canOffsetX') !== undefined ? _.get(options, 'canOffsetX') : this.canOffsetX;
    let canOffsetY = _.get(options, 'canOffsetY') !== undefined ? _.get(options, 'canOffsetY') : this.canOffsetY;
    let terOffsetX = _.get(options, 'terOffsetX') !== undefined ? _.get(options, 'terOffsetX') : this.terOffsetX;
    let terOffsetY = _.get(options, 'terOffsetY') !== undefined ? _.get(options, 'terOffsetY') : this.terOffsetY;
    if (pos === 'x') {
      const terCenter = terOffsetX + this.transformOriginX;
      // console.log((coordinate - terCenter - this.canOffsetX) / this.scale + this.terWidth / 2);
      return (coordinate - terCenter - canOffsetX) / scale + this.transformOriginX;
    }
    if (pos === 'y') {
      const terCenter = terOffsetY + this.transformOriginY;
      // console.log((coordinate - terCenter - this.canOffsetY) / this.scale + this.terHeight / 2);
      return (coordinate - terCenter - canOffsetY) / scale + this.transformOriginY;
    }
  }
}

module.exports = CoordinateService;
