'use strict';

export default class Point {
  constructor(x, y, w, h) {
    if (typeof x === 'string') {
      const xy = x.split(x.indexOf('@') === -1 ? ' ' : '@');
      x = parseFloat(xy[0]);
      y = parseFloat(xy[1]);

    } else if (Object(x) === x) {
      y = x.y;
      x = x.x;
    }

    this.x = x === undefined ? 0 : x;
    this.y = y === undefined ? 0 : y;
    this.w = w === undefined ? 0 : w;
    this.h = h === undefined ? 0 : h;
  }
  difference (dx, dy) {
    if ((Object(dx) === dx)) {
      dy = dx.y;
      dx = dx.x;
    }
    return new Point(this.x - (dx || 0), this.y - (dy || 0));
  }
  clone () {
    return new Point(this);
  }
  equals(p) {
    return !!p && this.x === p.x && this.y === p.y;
  }
  manhattanDistance(p) {
    return abs(p.x - this.x) + abs(p.y - this.y);
  }
  offset(dx, dy) {
    if ((Object(dx) === dx)) {
      dy = dx.y;
      dx = dx.x;
    }
    this.x += dx || 0;
    this.y += dy || 0;
    return this;
  }
  round(precision) {
    let f = 1;
    if (precision) {
        switch (precision) {
            case 1: f = 10; break;
            case 2: f = 100; break;
            case 3: f = 1000; break;
            default: f = pow(10, precision); break;
        }
    }

    this.x = Math.round(this.x * f) / f;
    this.y = Math.round(this.y * f) / f;
    return this;
  }
  snapToGrid(gx, gy) {
    const _snapToGrid = (v, g) => {
      return g * Math.round(v / g);
    }
    this.x = _snapToGrid(this.x, gx);
    this.y = _snapToGrid(this.y, gy || gx);
    return this;
  }
  theta(p) {
    p = new Point(p);
    // 反转 y 轴。
    const y = -(p.y - this.y);
    const x = p.x - this.x;
    let rad = Math.atan2(y, x); // 为所有 0 角情况定义

    // Correction for III. and IV. quadrant.
    if (rad < 0) {
        rad = 2 * Math.PI + rad;
    }
    return 180 * rad / Math.PI;
  }
  toString() {
    return this.x + '@' + this.y;
  }
  squaredDistance(p) {

    const start = this;
    const end= p;

    let x0 = start.x;
    let y0 = start.y;
    let x1 = end.x;
    let y1 = end.y;
    return (x0 -= x1) * x0 + (y0 -= y1) * y0;
  }
};