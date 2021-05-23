import {TreeNode} from 'butterfly-dag';
import $ from 'jquery';
import './node.less';

class BaseNode extends TreeNode {
  constructor(opts) {
    super(opts);
    this.addIcon = null;
    this.expandBtn = null;
  }
  draw(opts) {
    let container = $('<div class="rule-node"></div>')
      .css('top', opts.top + 'px')
      .css('left', opts.left + 'px')
      .attr('id', opts.id);

    this._attachEvent();
    return container[0];
  }
  _addEventListener() {
    // todo 做事件代理的形式
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
  _attachEvent() {
    $(this.expandBtn).on('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.collapsed) {
        // 可以在这里向后端请求数据,把node穿进去expand里面
        this.expand();
      } else {
        this.collapse();
      }
    });

    $(this.addIcon).on('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.emit('events', {
        type: 'custom:addSubNode',
        data: {
          parent: this.id
        }
      });
    });
  }
}

export default BaseNode;
