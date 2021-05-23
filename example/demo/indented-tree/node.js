import {TreeNode} from 'butterfly-dag';
import $ from 'jquery';
import './node.less';
class BaseNode extends TreeNode {
  constructor(opts) {
    super(opts);
    this.addIcon = null;
    this.expandBtn = null;
    this.indexExpandNode = null;
  }
  draw = (opts) => {
    let container = $('<div class="rule-node"></div>')
      .css('top', opts.top + 'px')
      .css('left', opts.left + 'px')
      .attr('id', opts.id);

    let textDom = $(`<span class="rule-text">${opts.options.desc}</span>`);
    this.indexExpandNode = $(`<div class="index-expand-node"></div>`);
    let iconBox = $(`<span class="icon-box"></span>`);

    this.addIcon = $(`<i class="iconfont add-icon" title="添加节点">&#xe6a1;</i>`);
    this.expandBtn = $(`<i class="iconfont expand-icon" title="展开">&#xe786;</i>`);
    iconBox.append(this.expandBtn);

    if (opts.options.condition) {
      let selectDom = $('<select class="rule-select"><option value="and">并且</option><option value="or">或者</option></select>');
      container.append(selectDom);
      textDom.addClass('text-right');
      container.append(this.addIcon);
      this.indexExpandNode.append(iconBox);
      this.indexExpandNode.append(textDom);
      container.append(this.indexExpandNode);
    } else {
      textDom.addClass('text-normal');
      container.append(textDom);
      container.append(this.addIcon);
      container.append(iconBox);
    }

    this._attachEvent();

    return container[0];
  }
  _attachEvent() {
    $(this.expandBtn).on('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      // TODO: 这里存在问题
      // if (this.collapsed) {
      //   // 可以在这里向后端请求数据,把node穿进去expand里面
      //   this.expand();
      // } else {
      //   this.collapse();
      // }
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
