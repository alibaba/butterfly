import _ from 'lodash';
import {TreeCanvas} from 'butterfly-dag';

export default (canvas, nodes = null) => {
  if (!canvas) {
    return;
  }
  if (!canvas.relayout) {
    const {type, options} = canvas.layout || {};
    
    canvas.relayout = function (nodes) {
      if (nodes) {
        // 自动布局
        canvas._autoLayout({...canvas, nodes});
        // 重置canvas.nodes的定位，用于re-layout.js的布局
        resetCanvasNodesPosition(canvas, nodes);
      } else {
        if (canvas.constructor === TreeCanvas) {
          canvas._autoLayout(canvas);
        } else if (type && options) {
          canvas.autoLayout(type, options || {});
        }
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

const resetCanvasNodesPosition = (canvas, nodes) => {
  let tempNodeObj = {};
  
  nodes.forEach(item => {
    tempNodeObj[item.id] = item;
  });

  canvas.nodes.forEach((item) => {
    if (_.get(tempNodeObj,`[${item.id}].left`)) {
      item.left = tempNodeObj[item.id].left;
    }
    if (_.get(tempNodeObj,`[${item.id}].top`)) {
      item.top = tempNodeObj[item.id].top;
    }
  })
}