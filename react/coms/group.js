import {Group} from 'butterfly-dag/dist';
import $ from 'jquery';

const getNodeStyle = (left, top) => {
  return {
    left: left + 'px',
    top: top + 'px',
    position: 'absolute'
  };
};

const groupFactory = (uniqId) => {
  class CustomGroup extends Group {
    draw(group) {
      const div = document.createElement('div');

      const style = getNodeStyle(group.left, group.top);
      Object.keys(style).forEach(key => {
        div.style[key] = style[key];
      });

      div.className = 'butterfly-group';

      div.id = uniqId + `bf_group_${group.id}`;
      div.className = 'butterflies-group';

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
            type: 'group:dragBegin',
            data: this
          });
        } else {
          // 单纯为了抛错事件给canvas，为了让canvas的dragtype不为空，不会触发canvas:click事件
          this.emit('InnerEvents', {
            type: 'group:mouseDown',
            data: this
          });
        }
      });
    }
  }

  return CustomGroup;
};

export default groupFactory;
