'use strict';

function circleLayout(params) {
  let radius = params.radius;
  let nodes = params.data.nodes.filter((node) => {
    return node._isCircle;
  });

  let _preAngle = 360 / nodes.length;
  let _halfWidth = 0;
  if (params.getWidth) {
    _halfWidth = params.getWidth() / 2;
  }
  let _halfHeight = 0;
  if (params.getHeight) {
    _halfWidth = params.getHeight() / 2;
  }

  nodes.forEach((item, index) => {
    let radian = (2 * Math.PI) / 360;
    let angle = index * _preAngle;
    let _top = (radius * Math.sin(angle * radian) - _halfHeight);
    let _left = (radius * Math.cos(angle * radian) - _halfWidth);

    let _textTop = ((radius + 30) * Math.sin(angle * radian) - _halfHeight);
    let _textLeft = ((radius + 30) * Math.cos(angle * radian) - _halfWidth);

    item.top = _top;
    item.left = _left;
    item.posInfo = {
      angle: angle,
      _textTop: _textTop,
      _textLeft: _textLeft
    };
  });
}

// module.exports = circleLayout;
export default {
  circleLayout
};