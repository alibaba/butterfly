'use strict';

import Point from './point';

const topLeft = (r) => {

  return new Point(r.x, r.y);
}

const topRight = (r) => {

  return new Point(r.x + r.w, r.y);
}

const bottomRight = (r) => {

  return new Point(r.x + r.w, r.y + r.h);
}

const bottomLeft = (r) => {

  return new Point(r.x, r.y + r.h);
}

const topLine = (r) => {
  return new Line(topLeft(r), topRight(r));
}

const rightLine = (r) => {
  return new Line(topRight(r), bottomRight(r));
}
const bottomLine = (r) => {
  return new Line(bottomLeft(r), bottomRight(r));
}

const leftLine = (r) => {
  return new Line(topLeft(r), bottomLeft(r));
}

const intersectionWithLine = (line, data) => {

  let pt1Dir = new Point(data.end.x - data.start.x, data.end.y - data.start.y);
  let pt2Dir = new Point(line.end.x - line.start.x, line.end.y - line.start.y);
  let det = (pt1Dir.x * pt2Dir.y) - (pt1Dir.y * pt2Dir.x);
  let deltaPt = new Point(line.start.x - data.start.x, line.start.y - data.start.y);
  let alpha = (deltaPt.x * pt2Dir.y) - (deltaPt.y * pt2Dir.x);
  let beta = (deltaPt.x * pt1Dir.y) - (deltaPt.y * pt1Dir.x);

  if (det === 0 || alpha * det < 0 || beta * det < 0) {
      // No intersection found.
      return null;
  }

  if (det > 0) {
      if (alpha > det || beta > det) {
          return null;
      }

  } else {
      if (alpha < det || beta < det) {
          return null;
      }
  }
  return new Point(
      data.start.x + (alpha * pt1Dir.x / det),
      data.start.y + (alpha * pt1Dir.y / det)
  );
}

const _intersectionWithLine = (line, shape) => {
  let r = shape;
  let rectLines = [topLine(r), rightLine(r), bottomLine(r), leftLine(r)];
  let points = [];
  let dedupeArr = [];
  let pt, i;
  let n = rectLines.length;
  for (i = 0; i < n; i++) {

      pt = intersectionWithLine(rectLines[i], line);
      let _pt = pt && pt.x + '@' + pt.y
      if (pt !== null && dedupeArr.indexOf(_pt) < 0) {
          points.push(pt);
          dedupeArr.push(_pt);
      }
  }
  return points.length > 0 ? points : null;
}

export default class Line {
  constructor(p1, p2) {
    if (!(this instanceof Line)) {
      return new Line(p1, p2);
    }

    if (p1 instanceof Line) {
        return new Line(p1.start, p1.end);
    }

    this.start = new Point(p1.x, p1.y);
    this.end = new Point(p2.x, p2.y);
  }
  intersect(shape) {
    if (shape) {
      let intersection = _intersectionWithLine(this, shape);
      if (intersection && (shape instanceof Line)) {
        intersection = intersection[0];
      }
      return intersection;
    }

    return null;
  }
}