export default (canvas) => {
  if (!canvas) {
    return;
  }

  canvas.relayout = function () {
    canvas._autoLayout(canvas);

    this.nodes.forEach(node => {
      node.moveTo(node.left, node.top);
    });

    if (canvas.recalc) {
      canvas.recalc();
    }
  };

  canvas.relayout();
};
