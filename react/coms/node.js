import {Node} from 'butterfly-dag/dist';
import $ from 'jquery';

const getNodeStyle = (left, top) => {
  return {
    left: left + 'px',
    top: top + 'px',
    position: 'absolute'
  };
};

const nodeFactor = (uniqId) => {
  class CustomNode extends Node {
    // 这个方法只会被调用一次
    draw(obj) {
      const div = document.createElement('div');
      const style = getNodeStyle(obj.left, obj.top);
      Object.keys(style).forEach(key => {
        div.style[key] = style[key];
      });

      div.className = 'butterfly-node';
      div.id = uniqId + 'bf_node_' + obj.id;

      return div;
    }

    _addEventListener() {
      $(this.dom).on('mousedown', (e) => {
        const LEFT_KEY = 0;
        if (e.button !== LEFT_KEY) {
          return;
        }

        if (this.draggable) {
          this._isMoving = true;
          this.emit('InnerEvents', {
            type: 'node:dragBegin',
            data: this
          });
        } else {
          // 单纯为了抛错事件给canvas，为了让canvas的dragtype不为空，不会触发canvas:click事件
          this.emit('InnerEvents', {
            type: 'node:mouseDown',
            data: this
          });
        }
      });
    }
  }

  return CustomNode;
};

export default nodeFactor;
