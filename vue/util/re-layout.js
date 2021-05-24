import _ from 'lodash';

export default (canvas, nodes = null) => {
  if (!canvas) {
    return;
  }
  if (!canvas.relayout) {
    canvas.relayout = function (nodes) {
      if (nodes) {
        // 自动布局
        canvas._autoLayout({...canvas, nodes});
        // 重置canvas.nodes的定位，用于re-layout.js的布局
        resetCanvasNodesPosition(canvas, nodes)
      } else {
        canvas._autoLayout(canvas);
      }
  
      this.nodes.forEach(node => {
        node.moveTo(node.left, node.top);
      });
  
      if (canvas.recalc) {
        canvas.recalc();
      }
    };
  } 
  canvas.relayout(nodes);
};

function resetCanvasNodesPosition(canvas, nodes) {
  let tempNodeObj = {};
  nodes.forEach(item => {
    tempNodeObj[item.id] = item;
  });
  canvas.nodes.forEach((item) => {
    if (_.get(tempNodeObj,'[item.id].left')) {
      item.left = tempNodeObj[item.id].left;
    }
    if (_.get(tempNodeObj,'[item.id].top')) {
      item.left = tempNodeObj[item.id].left;
    }
  })
}