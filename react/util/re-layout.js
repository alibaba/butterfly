export default (canvas) => {
  if (!canvas) {
    return;
  }

  const {type, options} = canvas.layout || {}
  canvas.relayout = function () {
    if (type) {
      canvas.autoLayout(type, options || {});
    } else {
      canvas._autoLayout(canvas);

      this.nodes.forEach(node => {
        node.moveTo(node.left, node.top);
      });
    }

    if (canvas.recalc) {
      canvas.recalc();
    }
  };

  canvas.relayout();
};
