'use strict';

const _ = require('lodash');

class CoordinateService {
  constructor(opts) {
    this.canvas = opts.canvas;
    this.terOffsetX = opts.terOffsetX || 0;
    this.terOffsetY = opts.terOffsetY || 0;
    this.terWidth = opts.terWidth || 0;
    this.terHeight = opts.terHeight || 0;
    this.canOffsetX = opts.canOffsetX || 0;
    this.canOffsetY = opts.canOffsetY || 0;
    this.scale = opts.scale || 1;

    // 中心点
    this.originX = undefined;
    this.originY = undefined;
    // 当前鼠标在容器内的坐标
    this._currentTerX = 0;
    this._currentTerY = 0;
  }

  _changeCanvasInfo(data) {
    if (data.terOffsetX !== undefined) {
      this.terOffsetX = data.terOffsetX;
    }
    if (data.terOffsetY !== undefined) {
      this.terOffsetY = data.terOffsetY;
    }
    if (data.terWidth !== undefined) {
      this.terWidth = data.terWidth;
    }
    if (data.terHeight !== undefined) {
      this.terHeight = data.terHeight;
    }
    if (data.canOffsetX !== undefined) {
      this.canOffsetX = data.canOffsetX;
    }
    if (data.canOffsetY !== undefined) {
      this.canOffsetY = data.canOffsetY;
    }
    if (data.scale !== undefined) {
      this._lastScale = this.scale;
      this.scale = data.scale;
    }
    if (data.canvas) {
      this.canvas = data.canvas;
    }

    let _isChangeOrigin = false;
    if (data.originX !== undefined) {
      this.originX = data.originX;
      _isChangeOrigin = true;
    }

    if (data.originY !== undefined) {
      this.originY = data.originY;
      _isChangeOrigin = true;
    }

    if (_isChangeOrigin) {
      this.canvas.wrapper.style.transformOrigin = `${this.originX}% ${this.originY}%`;
    }

    let _isChangeMouse = false;
    if (data.mouseX !== undefined) {
      if (this._currentTerX !== data.mouseX - this.terOffsetX) {
        this._currentTerX = (data.mouseX - this.terOffsetX);
        _isChangeMouse = true;
      }
    }
    if (data.mouseY !== undefined) {
      if (this._currentTerY !== data.mouseY - this.terOffsetY) {
        this._currentTerY = (data.mouseY - this.terOffsetY);
        _isChangeMouse = true;
      }
    }

    if (_isChangeMouse) {

      if (this.originX === undefined || this.originY === undefined) {
        this.originX = 0;
        this.originY = 0;
      }

      // i,j
      let i = this.originX / 100 * this.terWidth;
      let j = this.originY / 100 * this.terHeight;

      let oldOffset = [parseInt(this.canOffsetX) , parseInt(this.canOffsetY)];

      let _localtionX = (data.mouseX - (i * (1 - this._lastScale) + oldOffset[0]) - this.terOffsetX) / this._lastScale;
      let _localtionY = (data.mouseY - (j * (1 - this._lastScale) + oldOffset[1]) - this.terOffsetY) / this._lastScale;

      let newOriginX = _localtionX / this.terWidth * 100;
      let newOriginY = _localtionY / this.terHeight * 100;

      let e = -i * (1 - this._lastScale);
      let f = -j * (1 - this._lastScale);

      i = newOriginX / 100 * this.terWidth;
      j = newOriginY / 100 * this.terHeight;

      let g = -i * (1 - this._lastScale);
      let h = -j * (1 - this._lastScale);

      let _newLeft = g - e + oldOffset[0];
      let _newTop = h - f + oldOffset[1];

      this.canvas.wrapper.style.transformOrigin = `${newOriginX}% ${newOriginY}%`;
      this.canvas.move([_newLeft, _newTop]);
      this.originX = newOriginX;
      this.originY = newOriginY;
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
    let originX = _.get(options, 'originX') !== undefined ? _.get(options, 'originX') : this.originX || 0;
    let originY = _.get(options, 'originY') !== undefined ? _.get(options, 'originY') : this.originY || 0;
    if (pos === 'x') {
      let transformOriginX  = originX / 100 * this.terWidth;
      return coordinate * scale + (transformOriginX * (1 - scale) + canOffsetX) + terOffsetX;
    }
    if (pos === 'y') {
      let transformOriginY  = originY / 100 * this.terHeight;
      return coordinate * scale + (transformOriginY * (1 - scale) + canOffsetY) + terOffsetY;
    }
  }

  _terminal2canvas(pos, coordinate, options) {
    let scale = _.get(options, 'scale') || this.scale;
    let canOffsetX = _.get(options, 'canOffsetX') !== undefined ? _.get(options, 'canOffsetX') : this.canOffsetX;
    let canOffsetY = _.get(options, 'canOffsetY') !== undefined ? _.get(options, 'canOffsetY') : this.canOffsetY;
    let terOffsetX = _.get(options, 'terOffsetX') !== undefined ? _.get(options, 'terOffsetX') : this.terOffsetX;
    let terOffsetY = _.get(options, 'terOffsetY') !== undefined ? _.get(options, 'terOffsetY') : this.terOffsetY;
    let originX = _.get(options, 'originX') !== undefined ? _.get(options, 'originX') : this.originX || 0;
    let originY = _.get(options, 'originY') !== undefined ? _.get(options, 'originY') : this.originY || 0;
    if (pos === 'x') {
      let transformOriginX  = originX / 100 * this.terWidth;
      return (coordinate - (transformOriginX * (1 - scale) + canOffsetX) - terOffsetX) / scale;
    }
    if (pos === 'y') {
      let transformOriginY  = originY / 100 * this.terHeight;
      return (coordinate - (transformOriginY * (1 - scale) + canOffsetY) - terOffsetY) / scale;
    }
  }
}

export default CoordinateService;
