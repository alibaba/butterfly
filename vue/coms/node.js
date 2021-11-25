import {Node} from 'butterfly-dag';

const getNodeStyle = (left, top) => {
  return {
    left: left + 'px',
    top: top + 'px',
    position: 'absolute'
  };
};

class DefaultNode extends Node {
  
  draw = (obj) => {
    const div = document.createElement('div');
    const style = getNodeStyle(obj.left, obj.top);
    Reflect.ownKeys(style).forEach(key => {
      div.style[key] = style[key];
    });

    div.className = 'butterfly-node';
    div.id = 'bf_node_' + obj.id;

    return div;
  }

}

export default DefaultNode;